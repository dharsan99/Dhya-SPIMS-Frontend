import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProductionSummary } from '../../types/dashboard';

interface ProductionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProductionSummary;
}

function formatNumber(num: number | undefined | null, decimals = 0) {
  if (num == null || isNaN(num)) return '-';
  return num.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

const ProductionSummaryModal: React.FC<ProductionSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl flex flex-col items-center justify-center">
            <span className="text-gray-500">No production data available.</span>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  const sections = [
    { key: 'carding', label: 'Carding', color: 'green' },
    { key: 'drawing', label: 'Drawing', color: 'blue' },
    { key: 'framing', label: 'Framing', color: 'purple' },
    { key: 'simplex', label: 'Simplex', color: 'yellow' },
    { key: 'spinning', label: 'Spinning', color: 'indigo' },
    { key: 'autoconer', label: 'Autoconer', color: 'pink' },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      green: { bg: 'bg-green-100', text: 'text-green-800' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800' },
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const [expandedMachines, setExpandedMachines] = useState<Set<string>>(new Set());

  const toggleMachine = (machine: string) => {
    setExpandedMachines((prev) => {
      const next = new Set(prev);
      if (next.has(machine)) {
        next.delete(machine);
      } else {
        next.add(machine);
      }
      return next;
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-lg bg-white dark:bg-gray-900 p-0 shadow-xl">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Production Summary
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {/* Main Production Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Production Today</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(data.totalProduction)} kg
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Daily Production</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(data.avgDailyProduction)} kg
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Production Days</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.productionDays}
                </div>
              </div>
            </div>

            {/* Section Production Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Section Production
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sections.map((section) => {
                  const { bg, text } = getColorClasses(section.color);
                  return (
                    <div key={section.key} className={`${bg} ${text} p-4 rounded-lg`}>
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xl font-bold">
                        {formatNumber(data.sectionProduction[section.key as keyof typeof data.sectionProduction])} kg
                      </div>
                      <div className="text-sm mt-1">
                        Quality: {data.sectionQuality[section.key]?.issueRate.toFixed(1)}% issues
                      </div>
                      <div className="text-sm">
                        Downtime: {data.sectionDowntime[section.key]?.downtimeRate.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Machine Performance */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Machine Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Machine
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Production
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Efficiency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Shifts
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Issues
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.machineMetrics.map((machine) => (
                      <React.Fragment key={machine.machine}>
                        <tr
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          onClick={() => toggleMachine(machine.machine)}
                          tabIndex={0}
                          aria-label={`Expand details for ${machine.machine}`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                            <span>{machine.machine}</span>
                            <span className={`ml-2 transition-transform ${expandedMachines.has(machine.machine) ? 'rotate-90' : ''}`}>▶</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {formatNumber(machine.total_production)} kg
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {machine.efficiency.average.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {machine.shifts_operated}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              machine.quality_issues > 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {machine.quality_issues}
                            </span>
                          </td>
                        </tr>
                        {expandedMachines.has(machine.machine) && (
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={5} className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200">
                              <div className="flex flex-wrap gap-4">
                                <div>
                                  <span className="font-medium">Production Days:</span> {machine.production_days}
                                </div>
                                <div>
                                  <span className="font-medium">Shifts Operated:</span> {machine.shifts_operated}
                                </div>
                                <div>
                                  <span className="font-medium">Downtime Incidents:</span> {machine.downtime_incidents}
                                </div>
                                <div>
                                  <span className="font-medium">Quality Issues:</span> {machine.quality_issues}
                                </div>
                                <div>
                                  <span className="font-medium">Overall Efficiency:</span> {machine.efficiency.overall.toFixed(1)}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production Trend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Production Trend
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="space-y-2">
                  {data.productionTrend.map((trend) => (
                    <div key={trend.date} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(trend.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatNumber(trend.production)} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProductionSummaryModal; 