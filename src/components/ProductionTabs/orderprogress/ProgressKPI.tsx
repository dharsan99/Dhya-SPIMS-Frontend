import React from 'react';

export interface ProgressKPIProps {
  data: {
    requiredQty: number;
    producedQty: number;
    balanceQty: number;
    progressPercent: number;
  };
}

const ProgressKPI: React.FC<ProgressKPIProps> = ({ data }) => {
  const { requiredQty, producedQty, balanceQty, progressPercent } = data;

  const getColor = () => {
    if (progressPercent < 50) return 'text-red-600';
    if (progressPercent < 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const stats = [
    {
      label: 'Required Qty',
      value: `${requiredQty.toFixed(2)} kg`,
    },
    {
      label: 'Produced Qty',
      value: `${producedQty.toFixed(2)} kg`,
    },
    {
      label: 'Balance Qty',
      value: `${balanceQty.toFixed(2)} kg`,
    },
    {
      label: 'Progress',
      value: `${progressPercent.toFixed(1)}%`,
      color: getColor(),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded shadow p-4 border border-gray-100"
        >
          <p className="text-gray-500 text-sm">{item.label}</p>
          <p className={`text-lg font-semibold ${item.color || 'text-gray-800'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProgressKPI;