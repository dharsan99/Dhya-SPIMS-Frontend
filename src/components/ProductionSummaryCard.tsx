import { useQuery } from '@tanstack/react-query';
import {
  getDailyEfficiency,
  getMachineEfficiency,
  getProductionAnalytics,
} from '../api/production';
import Loader from './Loader';

interface DailyEfficiency {
  date: string;
  total_produced: number;
  total_required: number;
  efficiency: number;
}

interface MachineEfficiency {
  machine: string;
  total_produced: number;
  avg_efficiency: number;
  days: number;
}

interface Analytics {
  total_orders: number;
  total_produced: number;
  overall_efficiency: number;
}

const ProductionSummaryCard = () => {
  const {
    data: dailyEfficiency = [],
    isLoading: loadingDaily,
  } = useQuery<DailyEfficiency[]>({
    queryKey: ['dailyEfficiency'],
    queryFn: getDailyEfficiency,
  });

  const {
    data: machineEfficiency = [],
    isLoading: loadingMachine,
  } = useQuery<MachineEfficiency[]>({
    queryKey: ['machineEfficiency'],
    queryFn: getMachineEfficiency,
  });

  const {
    data: analytics,
    isLoading: loadingAnalytics,
  } = useQuery<Analytics>({
    queryKey: ['productionAnalytics'],
    queryFn: getProductionAnalytics,
  });

  if (loadingDaily || loadingMachine || loadingAnalytics) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* Cumulative Overview */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">📊 Cumulative Analytics</h2>
        <div className="space-y-1 text-sm">
          <p><strong>Total Orders:</strong> {analytics?.total_orders ?? 0}</p>
          <p><strong>Total Production:</strong> {analytics?.total_produced?.toFixed(2) ?? '0'} kg</p>
          <p><strong>Overall Efficiency:</strong> {analytics?.overall_efficiency?.toFixed(2) ?? '0'}%</p>
        </div>
      </div>

      {/* Daily Efficiency List */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">📅 Daily Efficiency</h2>
        <ul className="space-y-1 text-sm">
          {dailyEfficiency.map((entry) => (
            <li key={entry.date} className="flex justify-between">
              <span>{new Date(entry.date).toLocaleDateString('en-GB')}</span>
              <span className="text-right text-green-600">{entry.efficiency.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Machine Efficiency List */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">⚙️ Machine-wise Efficiency</h2>
        <ul className="space-y-1 text-sm">
          {machineEfficiency.map((entry) => (
            <li key={entry.machine} className="flex justify-between">
              <span>{entry.machine}</span>
              <span className="text-right text-indigo-600">{entry.avg_efficiency.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductionSummaryCard;