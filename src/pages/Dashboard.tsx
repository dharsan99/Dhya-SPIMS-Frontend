import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';


import { getAllOrders } from '../api/orders';
import { getLowStockFibres } from '../api/fibers';
import {
  getPendingSupplierTransfers,
  updateFibreTransferReceive,
} from '../api/fibreTransfers';

import { Order } from '../types/order';
import { Fiber } from '../types/fiber';
import { FibreTransfer } from '../types/fibreTransfer';
import { DashboardSummary } from '../types/dashboard';

import PendingOrdersCard from '../components/PendingOrdersCard';
import PendingFibersCard from '../components/PendingFibersCard';
import { QuickActions } from '../components/QuickActions';
import OperationsSummaryCard from '../components/OperationsSummaryCard';


import { computePendingFibres, convertSummaryToEntries } from '../utils/computePendingFibres';
import useAuthStore from '../hooks/auth';
import { fetchDashboardData } from '../api/dashboard';
import { DashboardHeader } from '../components/DashboardHeader';
import MetricCardsGrid from '../components/MetricCardsGrid';
import DashboardAlerts from '../components/DashboardAlerts';
import DashboardModals from '../components/DashboardModals';
import {
  hasUnreadItems
} from '../components/DashboardUtils';
import { useAIInsights } from '../context/AIInsightsContext';
import LazyLoadSection from '../components/LazyLoadSection';

import { useProgressiveLoading } from '../hooks/useProgressiveLoading';
import {
  MetricCardSkeleton,
  HeaderSkeleton,
  AlertsSkeleton,
  MobileViewSkeleton,
  StaggeredSkeleton
} from '../components/DashboardSkeletons';

const Dashboard: React.FC = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Progressive loading setup
  const sectionIds = [
    'header',
    'alerts', 
    'metric-cards',
    'operations-summary',
    'quick-actions',
    'charts',
    'mobile-content'
  ];
  
  const { loadingState, startLoading, finishLoading, setError, getSection } = useProgressiveLoading(sectionIds);

  // Use AI Insights Context
  const {
    aiInsights,
    generatingInsights,
    showAiInsights,
    setShowAiInsights,
    generateInsight
  } = useAIInsights();

  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  // Drill-down modal state
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
    type: 'financial' | 'operational' | 'growth' | 'sustainability';
  }>({
    isOpen: false,
    title: '',
    data: {},
    type: 'financial'
  });

  // Real-time updates and customization state
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30000); // 30 seconds
  const [customDashboard, setCustomDashboard] = useState({
    showHeadlineKPIs: true,
    showCriticalMetrics: true,
    showGrowthKPIs: true,
    showOperationalKPIs: true,
    showFinancialKPIs: true,
    showSustainabilityKPIs: true,
    showAnalytics: true,
    layout: 'default' as 'default' | 'compact' | 'detailed'
  });
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Mobile optimization and reporting state
  const [isMobile, setIsMobile] = useState(false);
  const [isReportingPanelOpen, setIsReportingPanelOpen] = useState(false);
  const [reportFilters] = useState({
    dateRange: 'last30days',
    metrics: ['all'],
    format: 'pdf'
  });
  const [, setExportLoading] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'dashboard' | 'reports' | 'settings'>('dashboard');

  // Progressive loading effect
  useEffect(() => {
    const loadSections = async () => {
      try {
        startLoading('header');
        
        // Load sections progressively
        await getSection('header');
        await getSection('alerts');
        await getSection('metric-cards');
        await getSection('operations-summary');
        await getSection('quick-actions');
        await getSection('charts');
        await getSection('mobile-content');
        
        finishLoading('header');
      } catch (error) {
        setError('header', 'Failed to load dashboard sections');
        console.error('Dashboard loading error:', error);
      }
    };

    loadSections();
  }, []);

  // Check for unread items on component mount
  useEffect(() => {
    setShowWhatsNew(hasUnreadItems());
  }, []);

  // Mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-specific layout adjustments
  useEffect(() => {
    if (isMobile) {
      // Auto-hide customization panel on mobile
      setIsCustomizing(false);
      // Set compact layout by default on mobile
      setCustomDashboard(prev => ({ ...prev, layout: 'compact' }));
    }
  }, [isMobile]);

  // Real-time update effect
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      setLastUpdateTime(new Date());
      toast.success('Dashboard updated with latest data');
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, autoRefreshInterval, queryClient]);

  // Helper function to open drill-down modal
  const openDrillDown = (title: string, type: 'financial' | 'operational' | 'growth' | 'sustainability', data: any) => {
    setDrillDownModal({
      isOpen: true,
      title,
      data,
      type
    });
  };

  // Helper function to close drill-down modal
  const closeDrillDown = () => {
    setDrillDownModal(prev => ({ ...prev, isOpen: false }));
  };

  // Helper function to toggle dashboard customization
  const toggleCustomization = () => {
    // If customization is being opened, close reporting panel
    if (!isCustomizing) {
      setIsReportingPanelOpen(false);
    }
    setIsCustomizing(!isCustomizing);
  };

  // Helper function to save dashboard preferences
  const saveDashboardPreferences = () => {
    localStorage.setItem('spims-dashboard-preferences', JSON.stringify(customDashboard));
    toast.success('Dashboard preferences saved');
    setIsCustomizing(false);
  };

  // Helper function to load dashboard preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem('spims-dashboard-preferences');
    if (savedPreferences) {
      setCustomDashboard(JSON.parse(savedPreferences));
    }
  }, []);

  const {
    data: orders = [],
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => getAllOrders({}),
  });

  useQuery<Fiber[]>({
    queryKey: ['lowStockFibres'],
    queryFn: getLowStockFibres,
  });

  useQuery<FibreTransfer[]>({
    queryKey: ['pendingTransfers'],
    queryFn: getPendingSupplierTransfers,
  });

  const {
    data: dashboardData,
    isLoading: loadingDashboardData
  } = useQuery<DashboardSummary>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  const summary = computePendingFibres(orders);
  const pendingFibres = convertSummaryToEntries(summary);

  const receiveTransferMutation = useMutation({
    mutationFn: ({ id, received_qty, received_date, remarks }: {
      id: string;
      received_qty: number;
      received_date: string;
      remarks?: string;
    }) => updateFibreTransferReceive(id, { received_qty, received_date, remarks }),
    onSuccess: () => {
      toast.success('Supplier return updated');
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] });
    },
    onError: () => toast.error('Failed to update return'),
  });

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action:', actionId);
  };



  // Special case for orders staff
  if (auth.user?.email === 'orders@nscspinning.com') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome to SPIMS
        </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You are logged in as an <strong>Order Staff</strong>
            </p>
          </div>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Click below to manage orders and track production progress.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/app/orders')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Proceed to Orders
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Reporting and export functions
  const generateReport = async (filters: typeof reportFilters) => {
    setExportLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = {
        dateRange: filters.dateRange,
        metrics: filters.metrics,
        format: filters.format,
        data: dashboardData,
        generatedAt: new Date().toISOString()
      };

      // Create downloadable report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spims-report-${new Date().toISOString().split('T')[0]}.${filters.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Report exported successfully as ${filters.format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setExportLoading(false);
    }
  };

  const toggleReportingPanel = () => {
    // If reporting panel is being opened, close customization panel
    if (!isReportingPanelOpen) {
      setIsCustomizing(false);
    }
    setIsReportingPanelOpen(!isReportingPanelOpen);
  };

  const handleMobileViewChange = (view: 'dashboard' | 'reports' | 'settings') => {
    setMobileViewMode(view);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progressive Loading Progress Bar */}
      {!loadingState.isFullyLoaded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-600"
          style={{ width: `${loadingState.overallProgress}%` }}
        />
      )}

      {/* Special case for orders staff */}
      {auth.user?.email === 'orders@nscspinning.com' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Welcome to SPIMS
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your comprehensive spinning mill management system
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-6 space-y-6"
        >
          {/* Header Section */}
          <LazyLoadSection
            skeleton={<HeaderSkeleton />}
            animation="slide-down"
            delay={0}
          >
            <DashboardHeader
              isMobile={isMobile}
              mobileViewMode={mobileViewMode}
              handleMobileViewChange={handleMobileViewChange}
              isRealTimeEnabled={isRealTimeEnabled}
              setIsRealTimeEnabled={setIsRealTimeEnabled}
              autoRefreshInterval={autoRefreshInterval}
              setAutoRefreshInterval={setAutoRefreshInterval}
              lastUpdateTime={lastUpdateTime}
              showAiInsights={showAiInsights}
              setShowAiInsights={setShowAiInsights}
              isReportingPanelOpen={isReportingPanelOpen}
              toggleReportingPanel={toggleReportingPanel}
              isCustomizing={isCustomizing}
              toggleCustomization={toggleCustomization}
            />
          </LazyLoadSection>

          {/* Customization Panel */}
          <AnimatePresence>
            {isCustomizing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="default"
                          checked={customDashboard.layout === 'default'}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, layout: e.target.value as any }))}
                          className="mr-2"
                        />
                        Default Layout
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="compact"
                          checked={customDashboard.layout === 'compact'}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, layout: e.target.value as any }))}
                          className="mr-2"
                        />
                        Compact Layout
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="detailed"
                          checked={customDashboard.layout === 'detailed'}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, layout: e.target.value as any }))}
                          className="mr-2"
                        />
                        Detailed Layout
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customDashboard.showHeadlineKPIs}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, showHeadlineKPIs: e.target.checked }))}
                          className="mr-2"
                        />
                        Headline KPIs
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customDashboard.showCriticalMetrics}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, showCriticalMetrics: e.target.checked }))}
                          className="mr-2"
                        />
                        Critical Metrics
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customDashboard.showAnalytics}
                          onChange={(e) => setCustomDashboard(prev => ({ ...prev, showAnalytics: e.target.checked }))}
                          className="mr-2"
                        />
                        Analytics
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real-time Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isRealTimeEnabled}
                          onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
                          className="mr-2"
                        />
                        Enable Real-time Updates
                      </label>
                      <select
                        value={autoRefreshInterval}
                        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        <option value={15000}>15 seconds</option>
                        <option value={30000}>30 seconds</option>
                        <option value={60000}>1 minute</option>
                        <option value={300000}>5 minutes</option>
                      </select>
                    </div>
                  </div>
        </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={toggleCustomization}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveDashboardPreferences}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metric Cards Grid with Virtual Scrolling for Large Datasets */}
          <LazyLoadSection
            skeleton={<StaggeredSkeleton count={6} SkeletonComponent={MetricCardSkeleton} />}
            animation="slide-up"
            delay={200}
          >
            <MetricCardsGrid
              dashboardData={dashboardData}
              loadingDashboardData={loadingDashboardData}
              isMobile={isMobile}
              customDashboard={customDashboard}
              showAiInsights={showAiInsights}
              aiInsights={aiInsights}
              generatingInsights={generatingInsights}
              onGenerateInsight={generateInsight}
              onOpenDrillDown={openDrillDown}
            />
          </LazyLoadSection>

          {/* Mobile View Mode Content */}
          {isMobile && mobileViewMode === 'reports' && (
            <LazyLoadSection
              skeleton={<MobileViewSkeleton />}
              animation="slide"
              delay={300}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Reports</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => generateReport({ ...reportFilters, dateRange: 'last7days' })}
                      className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Weekly Summary</span>
                      </div>
                      <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => generateReport({ ...reportFilters, dateRange: 'last30days' })}
                      className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <DocumentChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly Report</span>
                      </div>
                      <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => generateReport({ ...reportFilters, dateRange: 'last90days' })}
                      className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Quarterly Analysis</span>
                      </div>
                      <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </LazyLoadSection>
          )}

          {/* Mobile Settings View */}
          {isMobile && mobileViewMode === 'settings' && (
            <LazyLoadSection
              skeleton={<MobileViewSkeleton />}
              animation="slide"
              delay={300}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Layout Mode
                      </label>
                      <select
                        value={customDashboard.layout}
                        onChange={(e) => setCustomDashboard(prev => ({ ...prev, layout: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        <option value="default">Default</option>
                        <option value="compact">Compact</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto-refresh Interval
                      </label>
                      <select
                        value={autoRefreshInterval}
                        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        <option value={15000}>15 seconds</option>
                        <option value={30000}>30 seconds</option>
                        <option value={60000}>1 minute</option>
                        <option value={300000}>5 minutes</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={saveDashboardPreferences}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
        </div>
              </motion.div>
            </LazyLoadSection>
          )}

          {/* Desktop Dashboard Content - Only show when not in mobile reports/settings mode */}
          {(!isMobile || mobileViewMode === 'dashboard') && (
            <>
              {/* Dashboard Alerts */}
              <LazyLoadSection
                skeleton={<AlertsSkeleton />}
                animation="slide-up"
                delay={100}
              >
                <DashboardAlerts
                  dashboardData={dashboardData}
                  showWhatsNew={showWhatsNew}
                  setShowWhatsNew={setShowWhatsNew}
                />
              </LazyLoadSection>

              {/* Main Dashboard Content */}
              <LazyLoadSection
                skeleton={<StaggeredSkeleton count={2} SkeletonComponent={MetricCardSkeleton} />}
                animation="slide-up"
                delay={400}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                >
                  <PendingOrdersCard data={orders} />
                  <PendingFibersCard data={pendingFibres} />
                </motion.div>
              </LazyLoadSection>

                {/* Operations Summary */}
              <LazyLoadSection
                skeleton={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}
                animation="slide-up"
                delay={500}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                <OperationsSummaryCard summary={dashboardData} />
                </motion.div>
              </LazyLoadSection>

        {/* Quick Actions */}
              <LazyLoadSection
                skeleton={<div className="animate-pulse bg-gray-200 h-24 rounded-lg" />}
                animation="slide-up"
                delay={600}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
        <QuickActions onAction={handleQuickAction} />
                </motion.div>
              </LazyLoadSection>
            </>
          )}
        </motion.div>
      )}

      {/* Dashboard Modals */}
      <DashboardModals
        drillDownModal={drillDownModal}
        closeDrillDown={closeDrillDown}
        isReceiveModalOpen={isReceiveModalOpen}
        selectedTransferId={selectedTransferId}
        setIsReceiveModalOpen={setIsReceiveModalOpen}
        setSelectedTransferId={setSelectedTransferId}
        receiveTransferMutation={receiveTransferMutation}
      />
    </div>
  );
};export default Dashboard;