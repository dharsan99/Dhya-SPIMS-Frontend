import React, { useState } from 'react';
import { ProductionTimelineData } from '../api/dashboard';

interface ProductionTimelineProps {
  data: ProductionTimelineData[];
  isLoading: boolean;
  onBarClick?: (date: string) => void;
  selectedDate?: string;
}

function exportToCSV(data: ProductionTimelineData[]) {
  const header = 'Date,Actual,Target\n';
  const rows = data.map(d => `${d.date},${d.actual},${d.target}`).join('\n');
  const csv = header + rows;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'production-timeline.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export const ProductionTimeline: React.FC<ProductionTimelineProps> = ({
  data,
  isLoading,
  onBarClick,
  selectedDate,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[120px]">
        <span className="text-gray-500 dark:text-gray-400">No production data available.</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">Production Timeline</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500" /> Actual</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-dashed border-gray-400" /> Target</span>
          <button
            className="ml-4 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900"
            onClick={() => exportToCSV(data)}
            aria-label="Export timeline as CSV"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="space-y-4" role="list">
        {data.map((item) => {
          const isToday = item.date === today;
          const isSelected = item.date === selectedDate;
          const percent = Math.round((item.actual / item.target) * 100);
          return (
            <div key={item.date} className="flex items-center gap-4" role="listitem">
              <div className="w-24 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                {new Date(item.date).toLocaleDateString()}
              </div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 w-12 text-right flex-shrink-0">{item.actual}</span>
              <div className="flex-1 relative flex items-center">
                <button
                  className={`relative h-8 w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden focus:outline-none ${isToday ? 'ring-2 ring-blue-400' : ''} ${isSelected ? 'ring-2 ring-green-400' : ''}`}
                  onMouseEnter={() => setHovered(item.date)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onBarClick?.(item.date)}
                  aria-label={`Production for ${item.date}`}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onBarClick?.(item.date);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-400 transition-all duration-500"
                    style={{ width: `${Math.min((item.actual / item.target) * 100, 100)}%`, transitionProperty: 'width' }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full border-r-2 border-dashed border-gray-400 dark:border-gray-500"
                    style={{ width: '100%' }}
                  />
                  {/* Tooltip */}
                  {hovered === item.date && (
                    <div className="absolute left-1/2 -top-14 z-10 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg whitespace-nowrap pointer-events-none animate-fade-in">
                      <div><b>{new Date(item.date).toLocaleDateString()}</b></div>
                      <div>Actual: {item.actual}</div>
                      <div>Target: {item.target}</div>
                      <div>Achievement: {percent}%</div>
                    </div>
                  )}
                </button>
              </div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300 w-12 text-left flex-shrink-0">{item.target}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 