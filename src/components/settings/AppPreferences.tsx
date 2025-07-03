import { useThemeStore } from '../../hooks/useThemeStore';
import { useState } from 'react';

const AppPreferences = () => {
  const { theme, setTheme } = useThemeStore();
  const [selectedTheme, setSelectedTheme] = useState<typeof theme>(theme);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');

  const handleSave = () => {
    setTheme(selectedTheme);
    alert('Preferences saved successfully.');
  };

  return (
    <div className="space-y-8 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">App Preferences</h2>

      {/* Theme Preference */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme
        </label>
        <div className="flex gap-6">
          {(['light', 'dark', 'auto'] as const).map((option) => (
            <label
              key={option}
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name="theme"
                value={option}
                checked={selectedTheme === option}
                onChange={() => setSelectedTheme(option)}
                className="accent-blue-600 dark:accent-blue-400"
              />
              <span className="capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Language Preference */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 p-2 rounded w-full max-w-xs shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default AppPreferences;