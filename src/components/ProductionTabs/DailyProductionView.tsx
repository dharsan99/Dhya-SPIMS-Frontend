import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDailyEfficiency } from '../../api/production';
import Loader from '../Loader';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CSVLink } from 'react-csv';

interface DailyEntry {
  date: string;
  total_produced: number;
  total_required: number;
  efficiency: number;
}

const DailyProductionView = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data = [], isLoading } = useQuery<DailyEntry[]>({
    queryKey: ['dailyEfficiency'],
    queryFn: getDailyEfficiency,
  });

  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (
        (!start || entryDate >= start) &&
        (!end || entryDate <= end)
      );
    });
  }, [data, startDate, endDate]);

  const totalProduced = filteredData.reduce((sum, e) => sum + e.total_produced, 0);
  const totalRequired = filteredData.reduce((sum, e) => sum + e.total_required, 0);
  const avgEfficiency = totalRequired > 0 ? (totalProduced / totalRequired) * 100 : 0;

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700">Daily Production Overview</h2>
        <CSVLink
          filename="daily_production_export.csv"
          data={filteredData}
          className="bg-green-600 text-white px-4 py-1 rounded text-sm"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">Total Produced</p>
          <p className="text-xl font-semibold">{totalProduced.toFixed(2)} kg</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">Total Required</p>
          <p className="text-xl font-semibold">{totalRequired.toFixed(2)} kg</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">Average Efficiency</p>
          <p className="text-xl font-semibold">{avgEfficiency.toFixed(2)}%</p>
        </div>
      </div>

      {/* Line Chart Preview */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-GB')} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Produced (kg)</th>
              <th className="p-2">Required (kg)</th>
              <th className="p-2">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.date} className="border-t hover:bg-gray-50">
                <td className="p-2">{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                <td className="p-2">{entry.total_produced.toFixed(2)}</td>
                <td className="p-2">{entry.total_required.toFixed(2)}</td>
                <td className="p-2">{entry.efficiency.toFixed(2)}%</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-400">
                  No records found for selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyProductionView;