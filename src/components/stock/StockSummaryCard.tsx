import React, { useMemo } from 'react';
import { StockItem } from '@/types/stock';
import { Card, CardContent } from '@/components/ui/card';
import { Package, PackageCheck, AlertTriangle } from 'lucide-react';

interface Props {
  stock: StockItem[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'border-blue-600 text-blue-600',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <Card className={`flex-1 bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 ${color}`}>
    <CardContent className="flex items-center space-x-4">
      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-inherit`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-xl font-bold text-gray-800 dark:text-white">{value}</div>
      </div>
    </CardContent>
  </Card>
);



const StockSummaryCard: React.FC<Props> = ({ stock }) => {
  const { totalFibreTypes, totalStockKg, belowThresholdCount } = useMemo(() => {
    const uniqueFibreNames = new Set(stock.map(item => item.fibre_name));
    const totalStock = stock.reduce((sum, item) => sum + item.stock_kg, 0);
    const belowThreshold = stock.filter(item => item.stock_kg < item.threshold_kg).length;

    return {
      totalFibreTypes: uniqueFibreNames.size,
      totalStockKg: totalStock.toFixed(2),
      belowThresholdCount: belowThreshold,
    };
  }, [stock]);

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <StatCard
      icon={Package}
      label="Total Fibre Types"
      value={totalFibreTypes}
      color="border-purple-600 text-purple-600"
    />
    <StatCard
      icon={PackageCheck}
      label="Total Stock (kg)"
      value={totalStockKg}
      color="border-green-600 text-green-600"
    />
    <StatCard
      icon={AlertTriangle}
      label="Below Threshold"
      value={belowThresholdCount}
      color="border-red-600 text-red-600"
    />
  </div>
);

};

export default StockSummaryCard;
