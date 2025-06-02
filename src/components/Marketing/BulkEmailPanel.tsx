// BulkEmailPanel.tsx
import React, { useState } from 'react';
import CreateCampaignModal from './CreateCampaignModal';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../../api/marketing';
import { Campaign } from '../../types/marketing';

const BulkEmailPanel: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Past Campaigns</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Campaign
        </button>
      </div>

      {/* Campaign Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
      <tr>
        <th className="px-5 py-3 border-b dark:border-gray-700">Campaign Name</th>
        <th className="px-5 py-3 border-b dark:border-gray-700">Subject</th>
        <th className="px-5 py-3 border-b dark:border-gray-700">Recipients</th>
        <th className="px-5 py-3 border-b dark:border-gray-700">Created At</th>
      </tr>
    </thead>
    <tbody>
      {isLoading ? (
        <tr>
          <td colSpan={4} className="text-center px-5 py-4 text-gray-500">Loading...</td>
        </tr>
      ) : campaigns.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center px-5 py-4 text-gray-400 italic">No campaigns yet</td>
        </tr>
      ) : (
        campaigns.map((campaign, index) => (
          <tr
            key={campaign.id}
            className={`${
              index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
            } hover:bg-blue-50 dark:hover:bg-gray-700 transition`}
          >
            <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{campaign.name}</td>
            <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{campaign.subject}</td>
            <td className="px-5 py-3">
              <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                {campaign.recipients?.length || 0} emails
              </span>
            </td>
            <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
              {campaign.createdAt
                ? new Date(campaign.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    hour12: true,
                  })
                : '—'}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

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