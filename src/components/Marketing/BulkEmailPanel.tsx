// BulkEmailPanel.tsx
import React, { useState } from 'react';
import CreateCampaignModal from './CreateCampaignModal';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../../api/marketing';
import { Campaign } from '../../types/marketing';
import { FiMail, FiUsers, FiTrendingUp, FiEye } from 'react-icons/fi';

const BulkEmailPanel: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { data: campaignsData, isLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });

  // Defensive programming: ensure campaigns is always an array
  const campaigns = Array.isArray(campaignsData) ? campaignsData : [];
  
  // Debug logging
  console.log('Campaigns data:', campaignsData);
  console.log('Campaigns array:', campaigns);
  console.log('Is array:', Array.isArray(campaignsData));

  const getAnalyticsColor = (type: string) => {
    const colors = {
      sent: 'text-blue-600',
      delivered: 'text-green-600',
      opened: 'text-purple-600',
      clicked: 'text-indigo-600',
      bounced: 'text-red-600',
      complained: 'text-orange-600',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const formatAnalytics = (campaign: Campaign) => {
    const analytics = campaign.analytics || {
      totalEvents: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      complained: 0,
      uniqueRecipients: 0,
    };
    const totalRecipients = campaign.recipients?.length || 0;
    
    return {
      sent: analytics.sent || 0,
      delivered: analytics.delivered || 0,
      opened: analytics.opened || 0,
      clicked: analytics.clicked || 0,
      bounced: analytics.bounced || 0,
      complained: analytics.complained || 0,
      deliveryRate: totalRecipients > 0 ? ((analytics.delivered || 0) / totalRecipients * 100).toFixed(1) : '0',
      openRate: totalRecipients > 0 ? ((analytics.opened || 0) / totalRecipients * 100).toFixed(1) : '0',
    };
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Email Campaigns</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Create Campaign
        </button>
      </div>

      {/* Campaign Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 border-b dark:border-gray-700">Campaign</th>
              <th className="px-5 py-3 border-b dark:border-gray-700">Recipients</th>
              <th className="px-5 py-3 border-b dark:border-gray-700">Delivery Rate</th>
              <th className="px-5 py-3 border-b dark:border-gray-700">Open Rate</th>
              <th className="px-5 py-3 border-b dark:border-gray-700">Status</th>
              <th className="px-5 py-3 border-b dark:border-gray-700">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center px-5 py-4 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading campaigns...
                  </div>
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center px-5 py-8 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <FiMail className="w-8 h-8 text-gray-300" />
                    <p className="text-sm">No campaigns yet</p>
                    <p className="text-xs">Create your first email campaign to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign, index) => {
                const analytics = formatAnalytics(campaign);
                const hasAnalytics = campaign.analytics && Object.keys(campaign.analytics).length > 0;
                
                return (
                  <tr
                    key={campaign.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                    } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{campaign.recipients?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className={`w-4 h-4 ${getAnalyticsColor('delivered')}`} />
                        <span className={`font-medium ${getAnalyticsColor('delivered')}`}>
                          {analytics.deliveryRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiEye className={`w-4 h-4 ${getAnalyticsColor('opened')}`} />
                        <span className={`font-medium ${getAnalyticsColor('opened')}`}>
                          {analytics.openRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {hasAnalytics ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-500">No Data</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {campaign.createdAt
                        ? new Date(campaign.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            hour12: true,
                          })
                        : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Analytics Summary */}
      {campaigns.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Campaign Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Total Campaigns</div>
              <div className="font-semibold text-gray-900 dark:text-white">{campaigns.length}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Total Recipients</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {campaigns.reduce((sum, c) => sum + (c.recipients?.length || 0), 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Active Campaigns</div>
              <div className="font-semibold text-green-600">
                {campaigns.filter(c => c.analytics && Object.keys(c.analytics).length > 0).length}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Avg Delivery Rate</div>
              <div className="font-semibold text-blue-600">
                {(() => {
                  const campaignsWithData = campaigns.filter(c => c.analytics && c.analytics.delivered);
                  if (campaignsWithData.length === 0) return '0%';
                  const avgRate = campaignsWithData.reduce((sum, c) => {
                    const rate = (c.analytics!.delivered / (c.recipients?.length || 1)) * 100;
                    return sum + rate;
                  }, 0) / campaignsWithData.length;
                  return `${avgRate.toFixed(1)}%`;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateCampaignModal
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BulkEmailPanel;