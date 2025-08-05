import React from 'react';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  isMobile: boolean;
  mobileViewMode: 'dashboard' | 'reports' | 'settings';
  handleMobileViewChange: (view: 'dashboard' | 'reports' | 'settings') => void;
  isRealTimeEnabled: boolean;
  setIsRealTimeEnabled: (enabled: boolean) => void;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (interval: number) => void;
  lastUpdateTime: Date;
  showAiInsights: boolean;
  setShowAiInsights: (show: boolean) => void;
  isReportingPanelOpen: boolean;
  toggleReportingPanel: () => void;
  isCustomizing: boolean;
  toggleCustomization: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isMobile,
  mobileViewMode,
  handleMobileViewChange,
  isRealTimeEnabled,
  setIsRealTimeEnabled,
  autoRefreshInterval,
  setAutoRefreshInterval,
  lastUpdateTime,
  showAiInsights,
  setShowAiInsights,

  toggleReportingPanel,
  isCustomizing,
  toggleCustomization
}) => (
  <div className="mb-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Strategic Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time insights for strategic decision making
        </p>
      </div>
      {/* All Dashboard Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Mobile View Toggle - Only show on mobile */}
        {isMobile && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleMobileViewChange('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                mobileViewMode === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <ChartBarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMobileViewChange('reports')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                mobileViewMode === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <DocumentChartBarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMobileViewChange('settings')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                mobileViewMode === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Real-time Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isRealTimeEnabled
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <ClockIconSolid className={`w-4 h-4 ${isRealTimeEnabled ? 'animate-pulse' : ''}`} />
            {isMobile ? (isRealTimeEnabled ? 'Live' : 'Manual') : (isRealTimeEnabled ? 'Live' : 'Manual')}
          </button>
          {isRealTimeEnabled && (
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value={15000}>15s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
            </select>
          )}
        </div>
        {/* Last Update Time */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <ClockIconSolid className="w-3 h-3" />
            {isMobile ? 'Updated' : `Last: ${lastUpdateTime.toLocaleTimeString()}`}
          </div>
        )}
        {/* AI Insights Toggle Button */}
        <button
          onClick={() => setShowAiInsights(!showAiInsights)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            showAiInsights
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          {showAiInsights ? 'Hide AI Insights' : 'Show AI Insights'}
        </button>
        {/* Reporting Button */}
        <button
          onClick={toggleReportingPanel}
          className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
        >
          <DocumentChartBarIcon className="w-4 h-4" />
          {isMobile ? 'Reports' : 'Reports'}
        </button>
        {/* Customization Button */}
        <button
          onClick={toggleCustomization}
          className={`flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors ${
            isCustomizing ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          <Cog6ToothIcon className="w-4 h-4" />
          {isMobile ? 'Customize' : 'Customize'}
        </button>
      </div>
    </div>
  </div>
); 