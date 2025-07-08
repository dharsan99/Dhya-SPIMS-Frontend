// src/components/ThemeSelector.tsx
import { useThemeStore } from "../hooks/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
      className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
    >
      <option value="auto">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};

export default ThemeSelector;
