import React from 'react';
import { FiFileText, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiBarChart } from 'react-icons/fi';
import { ParsingUsageStats, ParsingMetrics } from '../../../types/usage';

interface ParsingUsagePanelProps {
  stats: ParsingUsageStats;
  metrics: ParsingMetrics;
}

const ParsingUsagePanel: React.FC<ParsingUsagePanelProps> = ({ stats, metrics }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Order Parsing Usage
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-center md:text-left">
            Track PDF parsing statistics and usage across all tenants
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FiClock className="w-4 h-4" />
          <span>Last updated: {formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Parsed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders Parsed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total_orders_parsed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <FiFileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Usage</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.parsing_usage_percentage}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.parsing_usage_percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.success_rate}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <FiCheckCircle className="w-4 h-4" />
              <span>{stats.successful_parses}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <FiXCircle className="w-4 h-4" />
              <span>{stats.failed_parses}</span>
            </div>
          </div>
        </div>

        {/* Average Processing Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Processing Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatTime(stats.average_processing_time)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500 text-white">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Last parsed: {formatDate(stats.last_parsed_at)}
          </div>
        </div>

        {/* Parsing Limit */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Parsing Limit
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.parsing_limit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-500 text-white">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Monthly limit across all tenants
          </div>
        </div>
      </div>

      {/* File Processing Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          File Processing Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.total_files_processed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.pdf_files.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">PDF Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.image_files.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Image Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatFileSize(metrics.average_file_size)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg File Size</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">OCR Usage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.ocr_usage_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Image-based extractions
            </div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiFileText className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Direct Extraction</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white bg-gray-300">
              {metrics.direct_text_extraction_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Text-based PDFs
            </div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-900 dark:text-white">Total Processing Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(metrics.total_processing_time)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cumulative time
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Parsing Trends
        </h3>
        <div className="space-y-3">
          {stats.monthly_parses.slice(-6).map((monthData, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900 dark:text-white min-w-[80px]">
                  {monthData.month}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    ✓ {monthData.successful_parses}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ {monthData.failed_parses}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {monthData.total_parses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParsingUsagePanel; 