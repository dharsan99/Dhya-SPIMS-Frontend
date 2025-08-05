import React, { useState, useEffect } from 'react';
import { EditableEmailTemplate } from '../../types/marketing';
import { TailwindDialog } from '../ui/Dialog';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  initialData?: EditableEmailTemplate;
  onClose: () => void;
  onSave: (data: EditableEmailTemplate) => void;
}

const TemplateEditorModal: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [template, setTemplate] = useState<EditableEmailTemplate>({
    name: '',
    subject: '',
    body: '',
  });

  // Default unsubscribe footer
  const defaultUnsubscribeFooter = `
<br><br>
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
<p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
  You can unsubscribe from these emails at any time by clicking 
  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #3b82f6; text-decoration: underline;">here</a>.
</p>
<p style="color: #6b7280; font-size: 12px; text-align: center; margin: 5px 0 0 0;">
  If you have any questions, please contact us.
</p>`;

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
      toast.error('All fields are required');
      return;
    }

    // Add unsubscribe footer if not already present
    let finalBody = template.body;
    if (!template.body.includes('{{{RESEND_UNSUBSCRIBE_URL}}}') && !template.body.includes('unsubscribe')) {
      finalBody = template.body + defaultUnsubscribeFooter;
    }

    onSave({
      ...template,
      body: finalBody
    });
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
  <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
    <p className="text-sm text-blue-700 dark:text-blue-300">
      💡 <strong>Unsubscribe Link:</strong> An unsubscribe link will be automatically added to your email template for compliance. 
      You can also manually add <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'{{{RESEND_UNSUBSCRIBE_URL}}}'}</code> anywhere in your content.
    </p>
  </div>
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