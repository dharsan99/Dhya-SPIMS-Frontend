import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEmailAnalytics, getEmailEvents, getBouncedEmails } from '../../api/webhooks';
import { EmailAnalytics, EmailEvent, BouncedEmail } from '../../types/webhooks';
import { FiMail, FiTrendingUp, FiAlertCircle, FiUsers, FiBarChart, FiRefreshCw, FiPause, FiPlay } from 'react-icons/fi';

const EmailAnalyticsPanel: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'bounces'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const queryClient = useQueryClient();

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing email analytics...');
      queryClient.invalidateQueries({ queryKey: ['emailAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['emailEvents'] });
      queryClient.invalidateQueries({ queryKey: ['bouncedEmails'] });
      setLastRefresh(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, queryClient]);

  // Manual refresh function
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered...');
    queryClient.invalidateQueries({ queryKey: ['emailAnalytics'] });
    queryClient.invalidateQueries({ queryKey: ['emailEvents'] });
    queryClient.invalidateQueries({ queryKey: ['bouncedEmails'] });
    setLastRefresh(new Date());
  };

  // Fetch analytics data with shorter stale time for live updates
  const { data: analytics, isLoading: analyticsLoading } = useQuery<EmailAnalytics>({
    queryKey: ['emailAnalytics', selectedPeriod],
    queryFn: async () => {
      const response = await getEmailAnalytics({ days: selectedPeriod });
      return response.data;
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Fetch recent events with live updates
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['emailEvents'],
    queryFn: async () => {
      const response = await getEmailEvents({ limit: 20 });
      return response.data;
    },
    staleTime: 5000, // 5 seconds for events
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Fetch bounced emails with live updates
  const { data: bouncesData, isLoading: bouncesLoading } = useQuery({
    queryKey: ['bouncedEmails'],
    queryFn: async () => {
      const response = await getBouncedEmails({ limit: 20 });
      return response.data;
    },
    staleTime: 15000, // 15 seconds for bounces
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  const events = eventsData?.events || [];
  const bounces = bouncesData?.bounces || [];

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      SENT: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      OPENED: 'bg-purple-100 text-purple-800',
      CLICKED: 'bg-indigo-100 text-indigo-800',
      BOUNCED: 'bg-red-100 text-red-800',
      COMPLAINED: 'bg-orange-100 text-orange-800',
      DELIVERY_DELAYED: 'bg-yellow-100 text-yellow-800',
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBounceTypeColor = (bounceType: string) => {
    const colors = {
      HARD: 'bg-red-100 text-red-800',
      SOFT: 'bg-yellow-100 text-yellow-800',
      SUPPRESSED: 'bg-orange-100 text-orange-800',
    };
    return colors[bounceType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatLastRefresh = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      {/* Header with Live Refresh Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Email Analytics</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiRefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>Last updated: {formatLastRefresh(lastRefresh)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auto-refresh toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {autoRefresh ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
              {autoRefresh ? 'Live' : 'Paused'}
            </button>
          </div>

          {/* Refresh interval selector */}
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
            disabled={!autoRefresh}
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={analyticsLoading || eventsLoading || bouncesLoading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Live Status Indicator */}
      {autoRefresh && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-400 font-medium">
            Live updates enabled • Refreshing every {refreshInterval}s
          </span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'overview', label: 'Overview', icon: <FiBarChart /> },
          { key: 'events', label: 'Recent Events', icon: <FiMail /> },
          { key: 'bounces', label: 'Bounced Emails', icon: <FiAlertCircle /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Analytics Cards with Live Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg relative">
                <div className="flex items-center gap-3">
                  <FiMail className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalEvents}</p>
                  </div>
                </div>
                {autoRefresh && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg relative">
                <div className="flex items-center gap-3">
                  <FiUsers className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unique Recipients</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.uniqueRecipients}</p>
                  </div>
                </div>
                {autoRefresh && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg relative">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bounces</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.bounceCount}</p>
                  </div>
                </div>
                {autoRefresh && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg relative">
                <div className="flex items-center gap-3">
                  <FiTrendingUp className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Period</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.period}</p>
                  </div>
                </div>
                {autoRefresh && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Event Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Event Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.eventBreakdown).map(([eventType, count]) => (
                  <div key={eventType} className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(eventType)}`}>
                      {eventType}
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Email Events</h3>
              {autoRefresh && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates</span>
                </div>
              )}
            </div>
            {eventsLoading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No events found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {events.map((event: EmailEvent) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{event.recipient}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {event.campaign?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {new Date(event.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bounces' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bounced Email Addresses</h3>
              {autoRefresh && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates</span>
                </div>
              )}
            </div>
            {bouncesLoading ? (
              <div className="text-center py-8">Loading bounces...</div>
            ) : bounces.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bounced emails found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Bounced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bounces.map((bounce: BouncedEmail) => (
                      <tr key={bounce.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{bounce.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getBounceTypeColor(bounce.bounceType)}`}>
                            {bounce.bounceType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {bounce.bounceMessage || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {new Date(bounce.lastBounced).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAnalyticsPanel; 