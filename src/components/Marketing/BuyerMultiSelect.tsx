import React from 'react';

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
}

const dummyBuyers = [
  { id: '1', name: 'ABC Textiles' },
  { id: '2', name: 'Vishnu Fabrics' },
  { id: '3', name: 'Global Exporters' },
];

const BuyerMultiSelect: React.FC<Props> = ({ value, onChange }) => {
  const toggleBuyer = (id: string) => {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Buyers</label>
      <div className="grid grid-cols-2 gap-2">
        {dummyBuyers.map((b) => (
          <label key={b.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(b.id)}
              onChange={() => toggleBuyer(b.id)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-800 dark:text-white">{b.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BuyerMultiSelect;