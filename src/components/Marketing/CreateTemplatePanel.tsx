import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmailTemplate } from '../../api/emailTemplates';
import { EditableEmailTemplate } from '../../types/marketing';
import toast from 'react-hot-toast';
import { TailwindDialog } from '../ui/Dialog';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface CreateTemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTemplatePanel: React.FC<CreateTemplatePanelProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [template, setTemplate] = useState<EditableEmailTemplate>({
    name: '',
    subject: '',
    body: '',
  });

  const createMutation = useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      toast.success('Template created');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      onClose();
      setTemplate({ name: '', subject: '', body: '' });
    },
    onError: () => toast.error('Failed to create template'),
  });

  const handleSubmit = () => {
    if (!template.name || !template.subject || !template.body) {
      toast.error('All fields are required');
      return;
    }
    createMutation.mutate(template);
  };

  return (
<TailwindDialog
  isOpen={isOpen}
  onClose={onClose}
  title="Create Email Template"
  maxWidth="max-w-4xl" // ✅ Correct usage
>
      <div className="w-full max-w-4xl mx-auto space-y-4 max-h-[75vh] overflow-y-auto">
    {/* Template Name */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        Template Name
      </label>
      <input
        type="text"
        placeholder="e.g. Price List"
        value={template.name}
        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
        className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    </div>

    {/* Email Subject */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        Email Subject
      </label>
      <input
        type="text"
        placeholder="e.g. January Price List"
        value={template.subject}
        onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
        className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    </div>

    {/* Rich HTML Editor */}
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        Email Body (HTML Supported)
      </label>
      <ReactQuill
  value={template.body}
  onChange={(value) => setTemplate({ ...template, body: value })}
  theme="snow"
  className="bg-white dark:bg-gray-900 rounded"
  modules={{
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  }}
/>
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
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Template
      </button>
    </div>
  </div>
</TailwindDialog>
  );
};

export default CreateTemplatePanel;