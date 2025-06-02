import { useState } from 'react';

const Integrations = () => {
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [tallyIntegration, setTallyIntegration] = useState(false);

  return (
    <div className="space-y-8 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">Integrations</h2>

      {/* AI Suggestions */}
      <section className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border rounded shadow-sm dark:border-gray-700">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-100">Enable AI Suggestions</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use AI to recommend optimal fibre mixes, improve production planning, and reduce waste.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={aiSuggestions}
            onChange={(e) => setAiSuggestions(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-colors relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-full"></div>
        </label>
      </section>

      {/* Tally Integration */}
      <section className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border rounded shadow-sm dark:border-gray-700">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-100">Connect to Tally</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enable seamless data sync with Tally for financial reporting and invoicing.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={tallyIntegration}
            onChange={(e) => setTallyIntegration(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-colors relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-full"></div>
        </label>
      </section>
    </div>
  );
};

export default Integrations;