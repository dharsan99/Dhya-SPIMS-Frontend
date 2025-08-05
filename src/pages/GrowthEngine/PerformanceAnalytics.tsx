import React, { useState, useEffect } from 'react';
import { 
  getAnalyticsDashboard, 
  getCampaignAnalytics,
  getGrowthMetrics,
  AnalyticsDashboardResponse,
  CampaignAnalyticsResponse,
  GrowthMetricsResponse 
} from '../../api/growth';
import { TrendingUp, TrendingDown, Users, Mail, Eye, MousePointer, MessageSquare, UserX, Calendar, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection, 
  subtitle,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} bg-white shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface TimeframeSelectorProps {
  timeframe: '7d' | '30d' | '90d' | '1y';
  onTimeframeChange: (timeframe: '7d' | '30d' | '90d' | '1y') => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ timeframe, onTimeframeChange }) => {
  const options = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onTimeframeChange(option.value as '7d' | '30d' | '90d' | '1y')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            timeframe === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Generate metrics array based on dashboard data
const generateMetrics = (dashboardData: AnalyticsDashboardResponse) => [
  {
    title: "Total Campaigns",
    value: dashboardData.overview.totalCampaigns,
    icon: <Target size={20} />,
    color: "blue" as const,
    subtitle: `${dashboardData.recentActivity.campaignsCreated} created recently`
  },
  {
    title: "Active Contacts",
    value: dashboardData.overview.activeContacts,
    icon: <Users size={20} />,
    color: "green" as const,
    subtitle: `${dashboardData.recentActivity.contactsAcquired} acquired recently`
  },
  {
    title: "Emails Sent",
    value: dashboardData.performance.emailsSent,
    icon: <Mail size={20} />,
    color: "purple" as const,
    subtitle: `${dashboardData.recentActivity.emailsGenerated} generated recently`
  },
  {
    title: "Reply Rate",
    value: `${dashboardData.performance.replyRate}%`,
    icon: <MessageSquare size={20} />,
    color: "orange" as const,
    subtitle: `${dashboardData.performance.emailsReplied} replies received`
  }
];

const PerformanceAnalytics: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardResponse | null>(null);
  const [, setCampaignData] = useState<CampaignAnalyticsResponse | null>(null);
  const [, setGrowthData] = useState<GrowthMetricsResponse | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, campaigns, growth] = await Promise.all([
        getAnalyticsDashboard(timeframe),
        getCampaignAnalytics(),
        getGrowthMetrics(timeframe)
      ]);

      setDashboardData(dashboard);
      setCampaignData(campaigns);
      setGrowthData(growth);
    } catch (err: any) {
      console.error('Error loading analytics data:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800 font-medium">Error loading analytics</span>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="p-6">No data available</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2 max-w-[30px] flex-wrap">Track campaign performance and growth metrics with detailed analytics</p>
        </div>
        <TimeframeSelector timeframe={timeframe} onTimeframeChange={setTimeframe} />
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {generateMetrics(dashboardData).map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Eye className="text-blue-600" size={16} />
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-xl font-bold text-gray-900">{dashboardData.performance.openRate}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MousePointer className="text-green-600" size={16} />
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-xl font-bold text-gray-900">{dashboardData.performance.clickRate}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MessageSquare className="text-purple-600" size={16} />
              <div>
                <p className="text-sm text-gray-600">Reply Rate</p>
                <p className="text-xl font-bold text-gray-900">{dashboardData.performance.replyRate}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={16} />
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-xl font-bold text-gray-900">{dashboardData.performance.bounceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span className="text-gray-700">Active Contacts</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.overview.activeContacts}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserX className="text-red-600" size={16} />
                <span className="text-gray-700">Suppressed</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.overview.suppressedContacts}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-600" size={16} />
                <span className="text-gray-700">Pending Tasks</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.overview.pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contacts</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Emails Sent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Replies</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reply Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topCampaigns.map((campaign) => (
                <tr key={campaign.campaignId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.campaignName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{campaign.contactsEnriched}</td>
                  <td className="py-3 px-4 text-gray-900">{campaign.emailsSent}</td>
                  <td className="py-3 px-4 text-gray-900">{campaign.emailsReplied}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      parseFloat(campaign.replyRate) > 5 ? 'text-green-600' :
                      parseFloat(campaign.replyRate) > 2 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {campaign.replyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{campaign.totalEngagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(dashboardData.breakdowns.emailStatus).map(([status, count]) => {
              const statusColors = {
                SENT: 'text-green-600',
                DRAFT: 'text-gray-600', 
                QUEUED: 'text-blue-600',
                FAILED: 'text-red-600',
                REPLIED: 'text-purple-600'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className={`font-medium ${statusColors[status as keyof typeof statusColors] || 'text-gray-600'}`}>
                    {status}
                  </span>
                  <span className="text-gray-900 font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Events</h3>
          <div className="space-y-3">
            {Object.entries(dashboardData.breakdowns.eventTypes).map(([type, count]) => {
              const eventColors = {
                OPENED: 'text-blue-600',
                CLICKED: 'text-green-600'
              };
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className={`font-medium ${eventColors[type as keyof typeof eventColors] || 'text-gray-600'}`}>
                    {type}
                  </span>
                  <span className="text-gray-900 font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Last updated: {new Date(dashboardData.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default PerformanceAnalytics; 