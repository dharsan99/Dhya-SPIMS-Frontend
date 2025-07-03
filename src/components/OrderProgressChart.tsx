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

  if (isLoading) return <div className="text-gray-500 dark:text-gray-400">Loading progress...</div>;
  if (error || !data) return <div className="text-red-600 dark:text-red-400">Error loading progress.</div>;

  const { requiredQty, producedQty } = data;
  const progressPercentage = requiredQty
    ? ((producedQty / requiredQty) * 100).toFixed(2)
    : '0.00';

  const chartData = [
    { name: 'Required', value: requiredQty },
    { name: 'Produced', value: producedQty },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 space-y-3 transition-colors duration-300">
      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">📦 Order Progress</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, bottom: 0, left: 20 }}
        >
          <XAxis type="number" stroke="#888" tick={{ fill: '#888' }} />
          <YAxis type="category" dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              color: 'white',
              borderRadius: '4px',
            }}
            labelStyle={{ color: '#93c5fd' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ color: '#6b7280' }} />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 4, 4]}>
            <LabelList dataKey="value" position="right" fill="#1e3a8a" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Completion: <span className="text-green-600 dark:text-green-400 font-semibold">{progressPercentage}%</span>
      </div>
    </div>
  );
};

export default OrderProgressChart;