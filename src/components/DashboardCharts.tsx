import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

// Chart Card Component for Analytics
const ChartCard = ({ 
  title, 
  children, 
  color = 'blue',
  loading = false,
  onClick
}: {
  title: string;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
  onClick?: () => void;
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
    yellow: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
    red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 animate-pulse ${colorClasses[color]}`}
      >
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
        onClick ? 'hover:ring-2 hover:ring-blue-500/20' : ''
      } ${colorClasses[color]}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  );
};

// Trend Chart Component
const TrendChart = ({ 
  data, 
  color = '#3B82F6',
  type = 'line'
}: {
  data: Array<{ name: string; value: number }>;
  color?: string;
  type?: 'line' | 'area' | 'bar';
}) => {
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    index
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'line' ? (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: color }}
          />
        </LineChart>
      ) : type === 'area' ? (
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={color}
            fillOpacity={0.3}
            strokeWidth={3}
          />
        </AreaChart>
      ) : (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

// Predictive Insight Component
const PredictiveInsight = ({ 
  title, 
  prediction, 
  confidence, 
  trend, 
  recommendation 
}: {
  title: string;
  prediction: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-yellow-600 dark:text-yellow-400'
  };

  const trendIcons = {
    up: <ArrowTrendingUpIcon className="w-5 h-5" />,
    down: <ArrowTrendingDownIcon className="w-5 h-5" />,
    stable: <div className="w-5 h-5 border-2 border-yellow-500 rounded-full"></div>
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
          {trendIcons[trend]}
          <span className="text-sm font-medium capitalize">{trend}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Prediction</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{prediction}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{confidence}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray={`${confidence}, 100`}
              />
            </svg>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recommendation</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Real-time Data Stream Component
const RealTimeDataStream = ({ isEnabled }: { isEnabled: boolean }) => {
  const [dataPoints, setDataPoints] = useState<Array<{ time: Date; value: number; type: string }>>([]);

  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date(),
        value: Math.random() * 100,
        type: ['production', 'quality', 'efficiency', 'energy'][Math.floor(Math.random() * 4)]
      };
      
      setDataPoints(prev => [...prev.slice(-19), newDataPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Data Stream</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {dataPoints.slice(-5).map((point, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                point.type === 'production' ? 'bg-blue-500' :
                point.type === 'quality' ? 'bg-green-500' :
                point.type === 'efficiency' ? 'bg-yellow-500' : 'bg-purple-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {point.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {point.value.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {point.time.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Comparison Component
const PerformanceComparison = ({ data }: { data: any }) => {
  // Only show comparison if we have real data
  const hasRealData = data?.headlineKPIs?.productionEfficiency !== undefined || 
                     data?.headlineKPIs?.operatingMargin !== undefined ||
                     data?.production?.sectionQuality?.spinning?.issueRate !== undefined ||
                     data?.machines?.runningMachines !== undefined;

  if (!hasRealData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance vs Targets</h3>
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          No performance data available
        </div>
      </div>
    );
  }

  const comparisonData = [
    { 
      metric: 'Production Efficiency', 
      actual: data?.headlineKPIs?.productionEfficiency || 0, 
      target: 85, 
      color: 'blue' 
    },
    { 
      metric: 'Operating Margin', 
      actual: data?.headlineKPIs?.operatingMargin || 0, 
      target: 20, 
      color: 'green' 
    },
    { 
      metric: 'Quality Score', 
      actual: data?.production?.sectionQuality?.spinning?.issueRate ? 
        (100 - data.production.sectionQuality.spinning.issueRate) : 0, 
      target: 95, 
      color: 'purple' 
    },
    { 
      metric: 'Machine Uptime', 
      actual: data?.machines?.runningMachines && data?.machines?.totalMachines ? 
        ((data.machines.runningMachines / data.machines.totalMachines) * 100) : 0, 
      target: 90, 
      color: 'orange' 
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance vs Targets</h3>
      <div className="space-y-4">
        {comparisonData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{item.metric}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {item.actual.toFixed(1)}% / {item.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  item.color === 'blue' ? 'bg-blue-500' :
                  item.color === 'green' ? 'bg-green-500' :
                  item.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min((item.actual / item.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile Chart Card Component
const MobileChartCard = ({ 
  title, 
  children, 
  color = 'blue',
  loading = false
}: {
  title: string;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
    yellow: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
    red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border animate-pulse ${colorClasses[color]}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border ${colorClasses[color]}`}>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <div className="h-32">
        {children}
      </div>
    </div>
  );
};

// Export all chart components
export {
  ChartCard,
  TrendChart,
  PredictiveInsight,
  RealTimeDataStream,
  PerformanceComparison,
  MobileChartCard
};

export default ChartCard; 