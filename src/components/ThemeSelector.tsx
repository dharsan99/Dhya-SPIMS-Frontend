// src/components/ThemeSelector.tsx
import { useThemeStore } from "../hooks/useThemeStore";

const ThemeSelector = () => {
  useThemeStore();

  return (
    <div className="p-2 rounded border bg-white text-sm">
      Light Mode
    </div>
  );
};

export default ThemeSelector;
