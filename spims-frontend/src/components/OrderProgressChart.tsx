// src/components/OrderProgressChart.tsx
import { useQuery } from '@tanstack/react-query';
import { getOrderProgress } from '../api/production';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

interface Props {
  orderId: string;
}

const OrderProgressChart = ({ orderId }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orderProgress', orderId],
    queryFn: () => getOrderProgress(orderId),
  });

  if (isLoading) return <div className="text-gray-500">Loading progress...</div>;
  if (error || !data) return <div className="text-red-600">Error loading progress.</div>;

  const { requiredQty, producedQty } = data;
  const progressPercentage = requiredQty
    ? ((producedQty / requiredQty) * 100).toFixed(2)
    : '0.00';

  const chartData = [
    { name: 'Required', value: requiredQty },
    { name: 'Produced', value: producedQty },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-5 space-y-3">
      <h3 className="text-lg font-bold text-blue-700">📦 Order Progress</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, bottom: 0, left: 20 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 4, 4]}>
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-600">
        Completion: <span className="text-green-600 font-semibold">{progressPercentage}%</span>
      </div>
    </div>
  );
};

export default OrderProgressChart;