// src/components/ProductionTabs/addproduction/FormPreviewCard.tsx

import React from 'react';

interface FormPreviewCardProps {
  data: {
    date: string;
    section: string;
    machine: string;
    shift: string;
    count: string;
    hank: string;
    production_kg: number;
    required_qty: number;
    remarks?: string;
    status: 'draft' | 'final';
  };
}

const FormPreviewCard: React.FC<FormPreviewCardProps> = ({ data }) => {
  const previewItems = [
    { label: 'Date', value: new Date(data.date).toLocaleDateString('en-GB') },
    { label: 'Section', value: data.section },
    { label: 'Machine', value: data.machine },
    { label: 'Shift', value: data.shift },
    { label: 'Count', value: data.count },
    { label: 'Hank', value: data.hank },
    { label: 'Production (kg)', value: `${data.production_kg.toFixed(2)} kg` },
    { label: 'Required (kg)', value: `${data.required_qty.toFixed(2)} kg` },
    { label: 'Remarks', value: data.remarks || '—' },
    { label: 'Status', value: data.status },
  ];

  return (
    <div className="bg-white p-6 rounded shadow space-y-4 mt-6">
      <h3 className="text-blue-700 font-semibold text-lg mb-2">📋 Production Preview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {previewItems.map((item) => (
          <div key={item.label} className="border-b pb-1">
            <p className="text-gray-500">{item.label}</p>
            <p className="font-medium text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPreviewCard;