import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMailingLists } from '../../api/mailingList';
import { getEmailTemplates } from '../../api/emailTemplates';
import { sendToAudience } from '../../api/marketing';
import { TailwindDialog } from '../ui/Dialog';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import useAuthStore from '../../hooks/auth';
import { injectInlineTableStyles } from '../../utils/emailEnhancer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCampaignModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const auth = useAuthStore();
  const tenantId = auth.user?.tenantId || '';

  const [selectedListId, setSelectedListId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBodyHtml, setEditableBodyHtml] = useState('');

  const { data: mailingLists = [] } = useQuery({
    queryKey: ['mailingLists'],
    queryFn: getMailingLists,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: getEmailTemplates,
  });

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectedMailingList = mailingLists.find((ml) => ml.id === selectedListId);

  useEffect(() => {
    if (selectedTemplate) {
      setEditableSubject(selectedTemplate.subject);
      setEditableBodyHtml(selectedTemplate.bodyHtml);
    }
  }, [selectedTemplateId]);

  const mutation = useMutation({
    mutationFn: sendToAudience,
    onSuccess: () => {
      toast.success('Campaign sent!');
      onClose();
    },
    onError: () => toast.error('Failed to send campaign'),
  });

  const handleSend = () => {
    if (!selectedMailingList || !editableSubject || !editableBodyHtml) {
      toast.error('All fields must be filled.');
      return;
    }

    // Check if mailing list has a Resend audience
    if (!selectedMailingList.resendAudienceId) {
      toast.error('Selected mailing list has no contacts. Please add contacts to the mailing list first.');
      return;
    }

    // Check if there are any contacts in the audience
    const contactCount = selectedMailingList.resendAudience?.contactCount || 0;
    if (contactCount === 0) {
      toast.error('No valid emails in selected mailing list.');
      return;
    }

    const styledHtml = injectInlineTableStyles(editableBodyHtml);

    const campaignData = {
      audienceId: selectedMailingList.resendAudienceId,
      subject: editableSubject,
      bodyHtml: styledHtml,
      tenant_id: tenantId,
    };

    console.log('📧 [FRONTEND] Sending campaign data:', {
      audienceId: campaignData.audienceId,
      subject: campaignData.subject,
      bodyHtml: campaignData.bodyHtml ? 'Present' : 'Missing',
      tenant_id: campaignData.tenant_id
    });

    // Send campaign to Resend audience
    mutation.mutate(campaignData);
  };

  return (
<TailwindDialog isOpen={isOpen} onClose={onClose} title="Create Campaign" maxWidth="max-w-3xl">
<div className="space-y-5 max-h-[75vh] overflow-y-auto w-full md:w-[720px]">
    
    {/* Mailing List */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Mailing List
      </label>
      <select
        value={selectedListId}
        onChange={(e) => setSelectedListId(e.target.value)}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">-- Select --</option>
        {mailingLists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
    </div>

    {/* Email Template */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email Template
      </label>
      <select
        value={selectedTemplateId}
        onChange={(e) => setSelectedTemplateId(e.target.value)}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">-- Select --</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>

    {/* Subject */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Subject
      </label>
      <input
        type="text"
        value={editableSubject}
        onChange={(e) => setEditableSubject(e.target.value)}
        placeholder="e.g. Price List"
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    </div>

    {/* HTML Editor */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email Body (HTML Supported)
      </label>
      <div className="rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800">
        <ReactQuill
          value={editableBodyHtml}
          onChange={setEditableBodyHtml}
          theme="snow"
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-3 pt-4">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        Cancel
      </button>
      <button
        onClick={handleSend}
        disabled={mutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {mutation.isPending ? 'Sending...' : 'Send Campaign'}
      </button>
    </div>
  </div>
</TailwindDialog>
  );
};

export default CreateCampaignModal;