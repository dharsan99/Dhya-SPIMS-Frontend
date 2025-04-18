import { FC } from 'react';

export interface TimelineEntry {
  date: string;
  machine: string;
  section: string;
  shift: string;
  production_kg: number;
  remarks?: string;
}

export interface ProgressTimelineProps {
  logs: TimelineEntry[];
}

const ProgressTimeline: FC<ProgressTimelineProps> = ({ logs }) => {
  const groupedByDate = logs.reduce<Record<string, TimelineEntry[]>>((acc, entry) => {
    const dateKey = new Date(entry.date).toLocaleDateString('en-GB');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold text-blue-700">Progress Timeline</h2>

      {Object.entries(groupedByDate).map(([date, entries]) => (
        <div key={date}>
          <h3 className="text-md font-semibold text-gray-800 mb-2">{date}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Machine</th>
                  <th className="p-2">Section</th>
                  <th className="p-2">Shift</th>
                  <th className="p-2">Production (kg)</th>
                  <th className="p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-2">{entry.machine}</td>
                    <td className="p-2">{entry.section}</td>
                    <td className="p-2">{entry.shift}</td>
                    <td className="p-2">{entry.production_kg.toFixed(2)}</td>
                    <td className="p-2 text-gray-500 italic">
                      {entry.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {logs.length === 0 && (
        <p className="text-gray-500 italic">No production logs available.</p>
      )}
    </div>
  );
};

export default ProgressTimeline;