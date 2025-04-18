import { useMemo } from 'react';

export interface LogEntry {
  date: string;
  production_kg: number;
  required_qty: number;
}

export interface EfficiencyInsightsProps {
  data: LogEntry[];
}

const EfficiencyInsights = ({ data }: EfficiencyInsightsProps) => {
    const insights = useMemo(() => {
      if (!Array.isArray(data) || data.length === 0) return [];
  
      const efficiencyData = data.map((log) => {
        const efficiency =
          log.required_qty > 0 ? (log.production_kg / log.required_qty) * 100 : 0;
        return {
          ...log,
          efficiency,
        };
      });
  
      const avgEfficiency =
        efficiencyData.reduce((sum, e) => sum + e.efficiency, 0) / efficiencyData.length;
  
      const sorted = [...efficiencyData].sort((a, b) => b.production_kg - a.production_kg);
      const topDay = sorted[0];
  
      const missingDays = efficiencyData.filter((e) => e.production_kg === 0);
  
      const insightsText: string[] = [];
  
      insightsText.push(`Average daily efficiency: ${avgEfficiency.toFixed(1)}%`);
  
      if (topDay) {
        insightsText.push(
          `Highest production was on ${new Date(topDay.date).toLocaleDateString('en-GB')} (${topDay.production_kg} kg)`
        );
      }
  
      if (missingDays.length > 0) {
        const days = missingDays.map((d) => new Date(d.date).toLocaleDateString('en-GB')).join(', ');
        insightsText.push(`No production on ${days}`);
      }
  
      return insightsText;
    }, [data]);
  
    return (
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="text-blue-700 font-semibold mb-2">Efficiency Insights</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {insights.map((text, idx) => (
            <li key={idx}>{text}</li>
          ))}
        </ul>
      </div>
    );
  };

export default EfficiencyInsights;