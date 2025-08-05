import React, { useState } from 'react';
import { TailwindDialog } from '../ui/Dialog';
import { createGrowthCampaign } from '../../api/growth';
import { useOptimizedToast } from '../../hooks/useOptimizedToast';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    keywords: [''],
    region: ''
  });
  const toast = useOptimizedToast();

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim() || !newCampaign.keywords[0]?.trim()) {
      toast.error('Please provide campaign name and at least one keyword');
      return;
    }

    try {
      setIsCreating(true);
      const keywords = newCampaign.keywords.filter(k => k.trim() !== '');
      const campaignData = {
        name: newCampaign.name.trim(),
        keywords,
        region: newCampaign.region.trim() || undefined
      };
      
      await createGrowthCampaign(campaignData);
      setNewCampaign({ name: '', keywords: [''], region: '' });
      toast.success('Campaign created and analysis started!');
      onSuccess();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const addKeyword = () => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const removeKeyword = (index: number) => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: prev.keywords.map((k, i) => i === index ? value : k)
    }));
  };

  const handleClose = () => {
    setNewCampaign({ name: '', keywords: [''], region: '' });
    onClose();
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Campaign"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleCreateCampaign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Campaign Name
          </label>
          <input
            type="text"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="e.g., Q4 2024 Textile Partners"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Keywords
          </label>
          {newCampaign.keywords.map((keyword, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => updateKeyword(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., sustainable textiles"
                required={index === 0}
              />
              {newCampaign.keywords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addKeyword}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            + Add Keyword
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Region (Optional)
          </label>
          <input
            type="text"
            value={newCampaign.region}
            onChange={(e) => setNewCampaign(prev => ({ ...prev, region: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="e.g., North America, Europe"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              'Create Campaign'
            )}
          </button>
        </div>
      </form>
    </TailwindDialog>
  );
};

export default CreateCampaignModal; 