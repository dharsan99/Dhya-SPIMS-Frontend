import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';

interface DebouncedSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
  className?: string;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  value,
  onDebouncedChange,
  delay = 400,
  className = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    onDebouncedChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${className}`}
        {...props}
      />
    </div>
  );
};

export default DebouncedSearchInput; 