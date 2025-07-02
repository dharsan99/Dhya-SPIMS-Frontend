// BulkEmailPanel.tsx
import React, { useState } from 'react';
import CreateCampaignModal from './CreateCampaignModal';
// import { useQuery } from '@tanstack/react-query';
// import { getCampaigns } from '../../api/marketing';
import { Campaign } from '../../types/marketing';

const BulkEmailPanel: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  // Comment out API call and use dummy data
  // const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
  //   queryKey: ['campaigns'],
  //   queryFn: getCampaigns,
  // });

  // Dummy data similar to JSON API response
  const dummyCampaigns: Campaign[] = [
    {
      id: "1",
      name: "Welcome Campaign",
      subject: "Welcome to Our Platform!",
      recipients: ["user1@example.com", "user2@example.com", "user3@example.com"],
      recipientsCount: 3,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2", 
      name: "Monthly Newsletter",
      subject: "January 2024 Newsletter",
      recipients: ["subscriber1@example.com", "subscriber2@example.com"],
      recipientsCount: 2,
      createdAt: "2024-01-20T14:15:00Z"
    },
    {
      id: "3",
      name: "Product Launch",
      subject: "New Feature Release",
      recipients: ["customer1@example.com", "customer2@example.com", "customer3@example.com", "customer4@example.com"],
      recipientsCount: 4,
      createdAt: "2024-01-25T09:45:00Z"
    }
  ];

  const campaigns = dummyCampaigns;
  const isLoading = false;

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
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
      <tr>
        <th className="px-4 py-3 text-left">Campaign Name</th>
        <th className="px-4 py-3 text-left">Subject</th>
        <th className="px-4 py-3 text-left">Recipients</th>
        <th className="px-4 py-3 text-left">Created At</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
      {isLoading ? (
        <tr>
          <td colSpan={4} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </td>
        </tr>
      ) : campaigns.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
            No campaigns yet.
          </td>
        </tr>
      ) : (
        campaigns.map((campaign) => (
          <tr
            key={campaign.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{campaign.name}</td>
            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{campaign.subject}</td>
            <td className="px-4 py-3">
              <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                {campaign.recipients?.length || 0} emails
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
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