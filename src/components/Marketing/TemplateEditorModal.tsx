import React, { useState, useEffect } from 'react';
import { EditableEmailTemplate } from '../../types/marketing';
import { TailwindDialog } from '../ui/Dialog';
import { useOptimizedToast } from '@/hooks/useOptimizedToast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  initialData?: EditableEmailTemplate;
  onClose: () => void;
  onSave: (data: EditableEmailTemplate) => void;
}

const TemplateEditorModal: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const { error } = useOptimizedToast();
  const [template, setTemplate] = useState<EditableEmailTemplate>({
    name: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    if (initialData) {
      setTemplate(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof EditableEmailTemplate, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!template.name || !template.subject || !template.body) {
      error('All fields are required');
      return;
    }
    onSave(template);
  };

  return (
    <TailwindDialog
      isOpen={true}
      onClose={onClose}
      title={initialData ? 'Edit Email Template' : 'Create Email Template'}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Template Name
          </label>
          <input
            type="text"
            placeholder="e.g. New Year Offer"
            value={template.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Email Subject
          </label>
          <input
            type="text"
            placeholder="e.g. Exciting Offers Inside!"
            value={template.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
    Email Body (HTML Supported)
  </label>
  <ReactQuill
    value={template.body}
    onChange={(value) => handleChange('body', value)}
    theme="snow"
    className=" bg-white dark:bg-gray-900 rounded"
    modules={{
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    }}
  />
</div>

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
            {initialData ? 'Update' : 'Create'} Template
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default TemplateEditorModal;