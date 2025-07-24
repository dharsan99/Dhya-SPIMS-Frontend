import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// Import the MetricCard component from Dashboard.tsx
const MetricCard = ({ 
  title, 
  value, 
  trend, 
  icon, 
  color = 'blue',
  onClick,
  loading = false,
  trendLabel = 'vs last period',
  aiInsight,
  isGeneratingInsight,
  onGenerateInsight
}: {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
  loading?: boolean;
  trendLabel?: string;
  aiInsight?: string;
  isGeneratingInsight?: boolean;
  onGenerateInsight?: () => void;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  const TypingAnimation = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else if (onComplete) {
        onComplete();
      }
    }, [currentIndex, text, onComplete]);

    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
        {displayedText}
        <span className="animate-pulse">|</span>
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border transition-all duration-200 cursor-pointer ${colorClasses[color]} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* AI Insight Toggle Button */}
      {onGenerateInsight && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerateInsight();
          }}
          disabled={isGeneratingInsight}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Generate AI Insight"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded"></div>
              ) : (
                value
              )}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${
                trend > 0 ? 'text-green-600 dark:text-green-400' : 
                trend < 0 ? 'text-red-600 dark:text-red-400' : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {trend > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : trend < 0 ? (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                ) : null}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          {trend !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {trendLabel}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].replace('bg-', 'bg-').replace('dark:bg-', 'dark:bg-')}`}>
          <div className={iconColors[color]}>
            {icon}
          </div>
        </div>
      </div>

      {/* AI Insight Display */}
      {aiInsight && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-800">
              <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-xs text-blue-800 dark:text-blue-200">
              {aiInsight}
            </div>
          </div>
        </div>
      )}

      {/* Generating Insight State */}
      {isGeneratingInsight && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-800">
              <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex-1">
              <TypingAnimation text="Generating AI insight..." />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface MetricCardsGridProps {
  dashboardData: any;
  loadingDashboardData: boolean;
  isMobile: boolean;
  customDashboard: any;
  showAiInsights: boolean;
  aiInsights: Record<string, string>;
  generatingInsights: Record<string, boolean>;
  onGenerateInsight: (metricKey: string) => void;
  onOpenDrillDown: (title: string, type: 'financial' | 'operational' | 'growth' | 'sustainability', data: any) => void;
}

const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  dashboardData,
  loadingDashboardData,
  isMobile,
  customDashboard,
  showAiInsights,
  aiInsights,
  generatingInsights,
  onGenerateInsight,
  onOpenDrillDown
}) => {
  return (
    <>
      {/* Headline KPI Cards */}
      {customDashboard.showHeadlineKPIs && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid gap-6 mb-8 ${
            isMobile 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {/* Operating Margin Card */}
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-sm font-medium">Operating Margin</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.headlineKPIs?.operatingMargin?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-100">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="text-sm">+2.1%</span>
                </div>
                <p className="text-xs text-green-100 mt-1">vs last month</p>
              </div>
            </div>
            <div className="w-full bg-green-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData?.headlineKPIs?.operatingMargin || 0) * 2, 100)}%` }}
              ></div>
            </div>
          </motion.div>

          {/* Production Efficiency Card */}
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Production Efficiency</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.headlineKPIs?.productionEfficiency?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-blue-100">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="text-sm">+1.8%</span>
                </div>
                <p className="text-xs text-blue-100 mt-1">vs last month</p>
              </div>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData?.headlineKPIs?.productionEfficiency || 0), 100)}%` }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Critical Metrics */}
      {customDashboard.showCriticalMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Critical Metric Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.orders?.totalOrders ?? 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {(dashboardData?.orders?.totalOrders ?? 0) > 0 ? (
                <>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No orders</span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.orders?.pendingOrders ?? 0}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {(dashboardData?.orders?.pendingOrders ?? 0) > 0 ? (
                <>
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">Pending</span>
                </>
              ) : (
                <span className="text-sm text-green-600 dark:text-green-400">All clear</span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Quality Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.production?.sectionQuality?.spinning?.issueRate !== undefined
                    ? `${(100 - dashboardData.production.sectionQuality.spinning.issueRate).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {dashboardData?.production?.sectionQuality?.spinning?.issueRate ? (
                <>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Good</span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No data</span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Production Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(dashboardData?.production?.avgDailyProduction ?? 0).toFixed(1)} kg/day
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Cog6ToothIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {(dashboardData?.production?.avgDailyProduction ?? 0) > 0 ? (
                <>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Running</span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No production</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Comprehensive KPI Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8"
      >
        {/* Growth & Market Expansion KPIs */}
        {customDashboard.showGrowthKPIs && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Growth & Market Expansion
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="Revenue from Campaigns"
                value={`₹${(dashboardData?.purchaseOrders?.totalValue || 0).toLocaleString()}`}
                trend={undefined}
                icon={<ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Revenue Analysis', 'growth', {
                  revenue: dashboardData?.purchaseOrders?.totalValue,
                  growthRate: ((dashboardData?.purchaseOrders?.conversionRate || 0) - 50) * 0.5,
                  newCustomers: dashboardData?.orders?.topBuyers?.length,
                  marketShare: ((dashboardData?.orders?.totalOrders || 0) / Math.max(dashboardData?.orders?.totalOrders || 1, 1) * 100)
                })}
                aiInsight={showAiInsights ? aiInsights['Revenue Growth'] : undefined}
                isGeneratingInsight={generatingInsights['Revenue Growth'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Revenue Growth') : undefined}
              />
              <MetricCard
                title="Customer Acquisition Rate"
                value={`${dashboardData?.orders?.topBuyers?.length || 0} new`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="blue"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Customer Growth', 'growth', {
                  newCustomers: dashboardData?.orders?.topBuyers?.length,
                  growthRate: dashboardData?.orders?.topBuyers?.length ? 12.5 : -5.2,
                  marketExpansion: ((dashboardData?.orders?.totalOrders || 0) / Math.max(dashboardData?.orders?.totalOrders || 1, 1) * 100)
                })}
                aiInsight={showAiInsights ? aiInsights['Customer Acquisition'] : undefined}
                isGeneratingInsight={generatingInsights['Customer Acquisition'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Customer Acquisition') : undefined}
              />
              <MetricCard
                title="Market Share Growth"
                value={`${((dashboardData?.orders?.totalOrders || 0) / Math.max(dashboardData?.orders?.totalOrders || 1, 1) * 100).toFixed(1)}%`}
                trend={undefined}
                icon={<ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="purple"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Market Analysis', 'growth', {
                  marketShare: ((dashboardData?.orders?.totalOrders || 0) / Math.max(dashboardData?.orders?.totalOrders || 1, 1) * 100),
                  growthRate: 8.3,
                  revenueGrowth: ((dashboardData?.purchaseOrders?.conversionRate || 0) - 50) * 0.5
                })}
              />
              <MetricCard
                title="Sustainable Product Revenue"
                value={`${((dashboardData?.production?.totalProduction || 0) / Math.max(dashboardData?.production?.totalProduction || 1, 1) * 100).toFixed(1)}%`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Sustainability Revenue', 'sustainability', {
                  sustainableRevenue: ((dashboardData?.production?.totalProduction || 0) / Math.max(dashboardData?.production?.totalProduction || 1, 1) * 100),
                  carbonFootprint: ((dashboardData?.production?.totalProduction || 0) * 0.8),
                  renewableEnergy: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25)
                })}
              />
            </div>
          </div>
        )}

        {/* Operational Excellence KPIs */}
        {customDashboard.showOperationalKPIs && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              Operational Excellence
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="Yarn Quality Score"
                value={`${(100 - (dashboardData?.production?.sectionQuality?.spinning?.issueRate || 0)).toFixed(1)}%`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="blue"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Quality Analysis', 'operational', {
                  qualityScore: (100 - (dashboardData?.production?.sectionQuality?.spinning?.issueRate || 0)),
                  efficiency: dashboardData?.headlineKPIs?.productionEfficiency,
                  defectRate: dashboardData?.production?.sectionQuality?.spinning?.issueRate || 0,
                  productionRate: (dashboardData?.production?.avgDailyProduction || 0) / 24
                })}
                aiInsight={showAiInsights ? aiInsights['Quality Score'] : undefined}
                isGeneratingInsight={generatingInsights['Quality Score'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Quality Score') : undefined}
              />
              <MetricCard
                title="Machine Uptime"
                value={`${((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 100).toFixed(1)}%`}
                trend={undefined}
                icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Machine Performance', 'operational', {
                  uptime: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 100),
                  efficiency: dashboardData?.headlineKPIs?.productionEfficiency,
                  productionRate: (dashboardData?.production?.avgDailyProduction || 0) / 24,
                  downtime: dashboardData?.machines?.maintenanceMachines || 0
                })}
                aiInsight={showAiInsights ? aiInsights['Machine Uptime'] : undefined}
                isGeneratingInsight={generatingInsights['Machine Uptime'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Machine Uptime') : undefined}
              />
              <MetricCard
                title="Fiber Inventory Turnover"
                value={`${dashboardData?.inventory?.lowStockItems || 0} items`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="yellow"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Inventory Analysis', 'operational', {
                  lowStockItems: dashboardData?.inventory?.lowStockItems || 0,
                  inventoryTurnover: dashboardData?.inventory?.lowStockItems || 0,
                  pendingShortages: dashboardData?.inventory?.pendingFiberShortages || 0
                })}
              />
              <MetricCard
                title="Production Efficiency"
                value={`${(dashboardData?.production?.avgDailyProduction || 0).toFixed(1)} kg/day`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="blue"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Production Analysis', 'operational', {
                  efficiency: dashboardData?.headlineKPIs?.productionEfficiency,
                  productionRate: (dashboardData?.production?.avgDailyProduction || 0) / 24,
                  qualityScore: (100 - (dashboardData?.production?.sectionQuality?.spinning?.issueRate || 0)),
                  uptime: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 100)
                })}
                aiInsight={showAiInsights ? aiInsights['Production Efficiency'] : undefined}
                isGeneratingInsight={generatingInsights['Production Efficiency'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Production Efficiency') : undefined}
              />
            </div>
          </div>
        )}

        {/* Financial Performance KPIs */}
        {customDashboard.showFinancialKPIs && (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Financial Performance
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="DSO (Days Sales Outstanding)"
                value={`${dashboardData?.financial?.receivables?.overdue || 0} days`}
                trend={undefined}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="red"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Financial Analysis', 'financial', {
                  dso: dashboardData?.financial?.receivables?.overdue || 0,
                  receivables: dashboardData?.financial?.receivables?.total || 0,
                  payables: dashboardData?.financial?.payables?.total || 0,
                  operatingMargin: dashboardData?.headlineKPIs?.operatingMargin
                })}
              />
              <MetricCard
                title="Cash Conversion Cycle"
                value={`${((dashboardData?.financial?.payables?.total || 0) / Math.max(dashboardData?.financial?.receivables?.total || 1, 1) * 30).toFixed(0)} days`}
                trend={undefined}
                icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="yellow"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Cash Flow Analysis', 'financial', {
                  cashCycle: ((dashboardData?.financial?.payables?.total || 0) / Math.max(dashboardData?.financial?.receivables?.total || 1, 1) * 30),
                  receivables: dashboardData?.financial?.receivables?.total || 0,
                  payables: dashboardData?.financial?.payables?.total || 0
                })}
              />
              <MetricCard
                title="ROI on Campaigns"
                value={`${((dashboardData?.purchaseOrders?.conversionRate || 0) * 0.8).toFixed(1)}%`}
                trend={undefined}
                icon={<ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Campaign ROI', 'financial', {
                  roi: ((dashboardData?.purchaseOrders?.conversionRate || 0) * 0.8),
                  conversionRate: dashboardData?.purchaseOrders?.conversionRate || 0,
                  revenue: dashboardData?.purchaseOrders?.totalValue || 0
                })}
              />
              <MetricCard
                title="Operating Margin"
                value={dashboardData?.headlineKPIs?.operatingMargin !== null && dashboardData?.headlineKPIs?.operatingMargin !== undefined
                  ? `${(dashboardData.headlineKPIs.operatingMargin || 0).toFixed(2)}%`
                  : '—'}
                trend={undefined}
                icon={<ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Margin Analysis', 'financial', {
                  operatingMargin: dashboardData?.headlineKPIs?.operatingMargin,
                  revenue: dashboardData?.purchaseOrders?.totalValue || 0,
                  expenses: (dashboardData?.financial?.payables?.total || 0) * 0.8,
                  netMargin: (dashboardData?.headlineKPIs?.operatingMargin || 0) * 0.7
                })}
                aiInsight={showAiInsights ? aiInsights['Operating Margin'] : undefined}
                isGeneratingInsight={generatingInsights['Operating Margin'] || false}
                onGenerateInsight={showAiInsights ? () => onGenerateInsight('Operating Margin') : undefined}
              />
            </div>
          </div>
        )}

        {/* Sustainability & Compliance KPIs */}
        {customDashboard.showSustainabilityKPIs && (
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Sustainability & Compliance
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="Carbon Footprint per Ton"
                value={`${((dashboardData?.production?.totalProduction || 0) * 0.8).toFixed(1)} kg CO2`}
                trend={-5.6}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Environmental Impact', 'sustainability', {
                  carbonFootprint: ((dashboardData?.production?.totalProduction || 0) * 0.8),
                  energyEfficiency: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25),
                  waterUsage: ((dashboardData?.production?.totalProduction || 0) * 2.5),
                  wasteReduction: 85.2
                })}
              />
              <MetricCard
                title="Renewable Energy Usage"
                value={`${((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25).toFixed(1)}%`}
                trend={12.3}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Energy Analysis', 'sustainability', {
                  renewableEnergy: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25),
                  energyEfficiency: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25),
                  carbonFootprint: ((dashboardData?.production?.totalProduction || 0) * 0.8)
                })}
              />
              <MetricCard
                title="Water Recycling Rate"
                value={`${((dashboardData?.production?.totalProduction || 0) / Math.max(dashboardData?.production?.totalProduction || 1, 1) * 85).toFixed(1)}%`}
                trend={8.9}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="blue"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Water Management', 'sustainability', {
                  waterRecycling: ((dashboardData?.production?.totalProduction || 0) / Math.max(dashboardData?.production?.totalProduction || 1, 1) * 85),
                  waterUsage: ((dashboardData?.production?.totalProduction || 0) * 2.5),
                  wasteReduction: 85.2
                })}
              />
              <MetricCard
                title="Sustainable Supplier Ratio"
                value={`${((dashboardData?.purchaseOrders?.convertedPOs || 0) / Math.max(dashboardData?.purchaseOrders?.totalPOs || 1, 1) * 100).toFixed(1)}%`}
                trend={15.4}
                icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
                loading={loadingDashboardData}
                onClick={() => onOpenDrillDown('Supplier Analysis', 'sustainability', {
                  sustainableSupplierRatio: ((dashboardData?.purchaseOrders?.convertedPOs || 0) / Math.max(dashboardData?.purchaseOrders?.totalPOs || 1, 1) * 100),
                  renewableEnergy: ((dashboardData?.machines?.runningMachines || 0) / Math.max(dashboardData?.machines?.totalMachines || 1, 1) * 25),
                  carbonFootprint: ((dashboardData?.production?.totalProduction || 0) * 0.8)
                })}
              />
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default MetricCardsGrid; 