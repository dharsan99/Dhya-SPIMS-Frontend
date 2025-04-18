// src/components/ProductionTabs/SummaryAnalytics.tsx
import { useQuery } from '@tanstack/react-query';
import {
  getProductionAnalytics,
  getDailyEfficiency,
  getMachineEfficiency,
} from '../../api/production';
import Loader from '../Loader';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface DailyEfficiencyEntry {
    shift: string;
    total_produced: number;
    total_required: number;
  }
  
  interface ShiftSummary {
    shift: string;
    totalProduced: number;
    totalRequired: number;
    avgEfficiency: number;
  }

const SummaryAnalytics = () => {
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['productionAnalytics'],
    queryFn: getProductionAnalytics,
  });

  const { data: dailyEfficiency = [], isLoading: loadingDaily } = useQuery({
    queryKey: ['dailyEfficiency'],
    queryFn: getDailyEfficiency,
  });

  const { data: machineEfficiency = [], isLoading: loadingMachine } = useQuery({
    queryKey: ['machineEfficiency'],
    queryFn: getMachineEfficiency,
  });

  const shiftSummary = useMemo<ShiftSummary[]>(() => {
    const shiftGroups: Record<string, DailyEfficiencyEntry[]> = {};
  
    dailyEfficiency.forEach((entry: DailyEfficiencyEntry) => {
      const shift = entry.shift || 'Unknown';
      if (!shiftGroups[shift]) shiftGroups[shift] = [];
      shiftGroups[shift].push(entry);
    });
  
    return Object.entries(shiftGroups).map(([shift, entries]) => {
      const totalProduced = entries.reduce((sum, e) => sum + e.total_produced, 0);
      const totalRequired = entries.reduce((sum, e) => sum + e.total_required, 0);
      const avgEfficiency = totalRequired > 0 ? (totalProduced / totalRequired) * 100 : 0;
      return {
        shift,
        totalProduced,
        totalRequired,
        avgEfficiency: parseFloat(avgEfficiency.toFixed(2)),
      };
    });
  }, [dailyEfficiency]);

  const topDays = [...dailyEfficiency]
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 3);

  const topMachines = [...machineEfficiency]
    .sort((a, b) => b.total_produced - a.total_produced)
    .slice(0, 3);

  if (loadingAnalytics || loadingDaily || loadingMachine) return <Loader />;

  return (
    <div className="space-y-8">
      {/* 1. Cumulative Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-xl font-bold">{analytics.total_orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Production</p>
          <p className="text-xl font-bold">{analytics.total_produced.toFixed(2)} kg</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Efficiency</p>
          <p className="text-xl font-bold">{analytics.overall_efficiency.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Machines Used</p>
          <p className="text-xl font-bold">{[...new Set(machineEfficiency.map((m: { machine: any; }) => m.machine))].length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Shifts Recorded</p>
          <p className="text-xl font-bold">{new Set(dailyEfficiency.map((d: any[]) => d.shift)).size}</p>
        </div>
      </div>

      {/* 2. Daily Efficiency Chart */}
      <div className="bg-white rounded p-4 shadow">
        <h3 className="text-blue-700 font-semibold mb-2">Daily Efficiency Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyEfficiency}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en-GB')} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency %" />
            <Line type="monotone" dataKey="total_produced" stroke="#10B981" name="Produced (kg)" />
            <Line type="monotone" dataKey="total_required" stroke="#F59E0B" name="Required (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Machine Efficiency Chart */}
      <div className="bg-white rounded p-4 shadow">
        <h3 className="text-blue-700 font-semibold mb-2">Machine Efficiency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={machineEfficiency}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="machine" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_efficiency" fill="#60A5FA" name="Efficiency (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Shift Summary */}
      <div className="bg-white rounded p-4 shadow">
        <h3 className="text-blue-700 font-semibold mb-2">Shift Summary</h3>
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Shift</th>
              <th className="p-2">Total Produced</th>
              <th className="p-2">Total Required</th>
              <th className="p-2">Avg Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {shiftSummary.map(s => (
              <tr key={s.shift} className="border-t">
                <td className="p-2">{s.shift}</td>
                <td className="p-2">{s.totalProduced.toFixed(2)}</td>
                <td className="p-2">{s.totalRequired.toFixed(2)}</td>
                <td className="p-2">{s.avgEfficiency.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-blue-600 font-semibold mb-2">Top Days by Efficiency</h4>
          {topDays.map((d) => (
            <p key={d.date} className="text-sm">
              {new Date(d.date).toLocaleDateString('en-GB')} – {d.efficiency.toFixed(2)}%
            </p>
          ))}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-blue-600 font-semibold mb-2">Top Machines by Output</h4>
          {topMachines.map((m) => (
            <p key={m.machine} className="text-sm">
              {m.machine} – {m.total_produced.toFixed(2)} kg
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryAnalytics;