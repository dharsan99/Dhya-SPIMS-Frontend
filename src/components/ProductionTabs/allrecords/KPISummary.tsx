import React from 'react';

export interface KPISummaryProps {
  totalRecords: number;
  totalProduction: number;
  totalRequired: number;
  avgEfficiency: number;
}

const KPISummary: React.FC<KPISummaryProps> = ({
  totalRecords = 0,
  totalProduction = 0,
  totalRequired = 0,
  avgEfficiency = 0,
}) => {
  const kpiItems = [
    {
      label: 'Total Records',
      value: totalRecords,
    },
    {
      label: 'Total Production (kg)',
      value: Number(totalProduction).toFixed(2),
    },
    {
      label: 'Total Required (kg)',
      value: Number(totalRequired).toFixed(2),
    },
    {
      label: 'Average Efficiency (%)',
      value: Number(avgEfficiency).toFixed(2),
    },
  ];

  return (
    <div className="bg-white p-6 rounded shadow grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {kpiItems.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-lg font-bold text-blue-700">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPISummary;