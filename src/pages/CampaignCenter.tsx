import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiTrendingUp, FiUsers, FiBarChart, FiPlus, FiArrowRight, FiTarget, FiZap } from 'react-icons/fi';

const CampaignCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Campaign Management Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unified dashboard for managing both email marketing campaigns and AI-powered growth campaigns
        </p>
      </div>

      {/* Campaign Types Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Email Marketing Campaigns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Email Marketing Campaigns
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Traditional bulk email campaigns with templates
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiUsers className="w-4 h-4 text-blue-500" />
              <span>Mailing list management</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiBarChart className="w-4 h-4 text-blue-500" />
              <span>Email analytics & tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiTarget className="w-4 h-4 text-blue-500" />
              <span>Template-based campaigns</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/marketing')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Create Email Campaign
            </button>
            <button
              onClick={() => navigate('/app/marketing')}
              className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              View All Campaigns
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Growth Engine Campaigns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FiTrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Growth Campaigns
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automated brand discovery & outreach campaigns
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiZap className="w-4 h-4 text-purple-500" />
              <span>AI-powered brand discovery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiTarget className="w-4 h-4 text-purple-500" />
              <span>Automated prospect outreach</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiBarChart className="w-4 h-4 text-purple-500" />
              <span>Performance analytics</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/growth/brand-discovery')}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Create Growth Campaign
            </button>
            <button
              onClick={() => navigate('/app/growth/brand-discovery')}
              className="w-full flex items-center justify-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              Manage Campaigns
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Campaign Management at a Glance
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📧</div>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">Email Marketing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Send targeted bulk emails to your existing customer base with detailed analytics
            </p>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🚀</div>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">Growth Engine</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AI-powered campaigns to discover new prospects and automate outreach
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Campaign Activity
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FiBarChart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Recent campaign activity will appear here</p>
          <p className="text-sm mt-1">Create your first campaign to get started</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignCenter; 