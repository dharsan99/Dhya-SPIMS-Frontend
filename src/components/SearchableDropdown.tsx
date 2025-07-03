import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const SearchableDropdown: React.FC<Props> = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
}) => {
  const [query, setQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={options.find((o) => o.value === value)?.label || query}
        placeholder='Search...'
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
          onChange(''); // Reset selection
        }}
        onFocus={() => setShowOptions(true)}
        required={required}
        className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showOptions && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No results</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setQuery(option.label);
                  setShowOptions(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;