import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Target, 
  TrendingUp, 
  Settings, 
  Plus,
  BarChart3,
  Mail,
  Users as UsersIcon
} from 'lucide-react';

const GrowthEngineDashboard: React.FC = () => {
  const [] = useState('overview');

  const stats = [
    {
      title: 'Active Campaigns',
      value: '3',
      change: '+12%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Discovered Brands',
      value: '47',
      change: '+8%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Qualified Leads',
      value: '12',
      change: '+25%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Email Sequences',
      value: '5',
      change: '+3',
      changeType: 'neutral',
      icon: Mail,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      title: 'Create Campaign',
      description: 'Start a new brand discovery campaign',
      icon: Plus,
      link: '/app/growth/brand-discovery',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Manage Persona',
      description: 'Update your company profile',
      icon: User,
      link: '/app/growth/persona',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'View Analytics',
      description: 'Check campaign performance',
      icon: BarChart3,
      link: '/app/growth/analytics',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Brand Discovery',
      description: 'Discover and manage campaigns',
      icon: Target,
      link: '/app/growth/brand-discovery',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const recentCampaigns = [
    {
      id: '1',
      name: 'Q4 EU Organic Push',
      status: 'ACTIVE',
      brands: 15,
      qualified: 3,
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'GOTS Baby Clothes',
      status: 'ANALYZING',
      brands: 8,
      qualified: 0,
      created: '2024-01-12'
    },
    {
      id: '3',
      name: 'Sustainable Fashion',
      status: 'COMPLETED',
      brands: 24,
      qualified: 9,
      created: '2024-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ANALYZING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PAUSED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Growth Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered brand discovery and automated outreach platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            <Settings className="w-4 h-4" />
          </button>
          <Link
            to="/app/growth/brand-discovery"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white p-6 rounded-lg transition-colors`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Campaigns
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created {new Date(campaign.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.brands}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Brands</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.qualified}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qualified</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/app/growth/brand-discovery"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all campaigns →
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Analytics - Now Available */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Analytics
            </h3>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
              Available Now
            </span>
          </div>
          <Link
            to="/app/growth/analytics"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Track campaign performance and growth metrics with comprehensive analytics including 
          engagement rates, conversion tracking, and detailed campaign insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Campaign Performance Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Email Engagement Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Growth Metrics & Trends</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthEngineDashboard; 