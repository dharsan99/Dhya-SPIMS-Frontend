// src/components/ProductionCharts.tsx
import { useQuery } from '@tanstack/react-query';
import {
  getDailyEfficiency,
  getMachineEfficiency,
} from '../api/production';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

import Loader from './Loader';
import { DailyEfficiency, MachineEfficiency } from '../types/production';

const ProductionCharts = () => {
  const {
    data: dailyEfficiency = [],
    isLoading: loadingDaily,
    error: errorDaily,
  } = useQuery<DailyEfficiency[]>({
    queryKey: ['dailyEfficiency'],
    queryFn: getDailyEfficiency,
  });

  const {
    data: machineEfficiency = [],
    isLoading: loadingMachine,
    error: errorMachine,
  } = useQuery<MachineEfficiency[]>({
    queryKey: ['machineEfficiency'],
    queryFn: getMachineEfficiency,
  });

  if (loadingDaily || loadingMachine) return <Loader />;
  if (errorDaily || errorMachine)
    return <div className="text-red-600 text-sm">Failed to load chart data.</div>;

  return (
    <div className="space-y-8 mt-8">
      {/* 📆 Daily Production Trend */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold text-blue-700 mb-4">📆 Daily Production Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyEfficiency} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString('en-GB')}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} kg`}
              labelFormatter={(label) =>
                `Date: ${new Date(label).toLocaleDateString('en-GB')}`
              }
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_produced"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Produced (kg)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="total_required"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Required (kg)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🛠 Machine-wise Efficiency */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold text-blue-700 mb-4">🛠 Machine-wise Efficiency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={machineEfficiency} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <XAxis dataKey="machine" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelFormatter={(label) => `Machine: ${label}`}
            />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="avg_efficiency"
              fill="#10B981"
              name="Avg Efficiency (%)"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionCharts;