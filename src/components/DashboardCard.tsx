import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  borderColor?: string; // Tailwind color class suffix like 'blue-500'
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  borderColor = 'blue-500',
}) => {
  return (
    <div className={`bg-white shadow rounded-lg p-4 border-l-4`} style={{ borderColor: `var(--tw-border-${borderColor})` }}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default DashboardCard;