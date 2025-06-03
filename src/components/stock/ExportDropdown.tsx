import React from 'react';
import Select from 'react-select';

interface ExportDropdownProps {
  onExport: (format: 'xlsx' | 'pdf') => void;
}

const options = [
  { value: 'xlsx', label: 'Export as XLSX' },
  { value: 'pdf', label: 'Export as PDF' },
];

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport }) => {
  return (
    <div className="flex justify-end mt-2">
      <div className="w-48">
        <Select
          options={options}
          placeholder="Export"
          onChange={(option) => {
            if (option) onExport(option.value as 'xlsx' | 'pdf');
          }}
          isSearchable={false}
        />
      </div>
    </div>
  );
};

export default ExportDropdown;